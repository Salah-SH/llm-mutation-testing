import os
import subprocess
import sys
import json
import argparse
import pandas as pd
import argcomplete
import os
from openai import OpenAI
import argcomplete
import pandas as pd
from dotenv import load_dotenv
import requests
import shutil

load_dotenv()
my_openai_key=os.getenv('OPENAI_APIKEY')
loopSize = int(os.getenv('LOOP_SIZE'))
mutantNbre=int(os.getenv('MUTANT_NBRE'))

template_initialTest_prompt=os.path.join(os.getcwd(),"prompt_templates","create_test_initial_prompt_template.txt")
template_correctTest_prompt=os.path.join(os.getcwd(),"prompt_templates","fix_test_syntax_prompt_template.txt")




def find_and_read_contract(folder_path, contract_name):
    # Search for the file in the folder and its subfolders
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file == contract_name:
                file_path = os.path.join(root, file)
                # Read the file
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
    return None


def remove_comments(code):
    lines = code.splitlines()

    filtered_lines = [line for line in lines if not line.strip().startswith("//")]
    code = ' '.join(filtered_lines)
    return code

def search_by_id(data, search_id):
    for _, mutations in data.items():
        for mutation in mutations:
            if mutation['id'] == search_id:
                return mutation['operator']
    return None

def create_dataset(project_path, datasetPath):

    # mutations_results = pd.read_csv(mutations_results_csv) 
    testResults = os.path.join(project_path, "sumo", "results", "results.csv")
    mutations_results = pd.read_csv(testResults)
    
    for index, row in mutations_results.iterrows():
        contract_name = row["File"].split("/")[-1]
        parts = row["File"].split("/contracts/")
        contractPath=project_path+"/sumo"+"/baseline" + "/contracts/"+parts[1]
        with open(contractPath, 'r', encoding='utf-8') as contract:
                    code = contract.read()
                    mutations_results.at[index,'Contract_code'] = code.replace('\n', ' ')
                    mutations_results.at[index,'Contract_id'] = contract_name

    mutants_code = mutations_results[["Hash","Contract_id","Contract_code","Status", "Original","Replacement","StartLine"]]
    mutants_code = mutants_code.rename(columns={'Hash': 'Mutant_id'})
    mutants_code['Details'] = mutants_code.apply(lambda row: f"{row['Original']} is mutated to : {row['Replacement']} at the line number {row['StartLine']}", axis=1)
    
    if not os.path.exists(os.path.join(os.getcwd(), "datasets")):
        os.makedirs(os.path.join(os.getcwd(), "datasets"))
    
    
    mutants_code.to_csv(datasetPath, index=False)
    
    print("Initial dataset save to folder :" , datasetPath)

##pre requist: need to have testMatrix.json generated using npx hardhat coverage --matrix
# maps every testfile to the smart contract its testing 
def add_initial_tests(project_directory, datasetPath):
        
        testMapping = os.path.join(project_directory, "testMatrix.json")
        if not os.path.isfile(testMapping):
            solc_command = ["npx", "hardhat", "coverage","--matrix"]
            try:
                    print(f"Executing npx hardhat coverage ")
                    subprocess.run(solc_command, check=True, text=True, cwd = project_directory)
                    print(f"Completed: hardhat coverage execution")
            except subprocess.CalledProcessError as e:
                    print(f"An error occurred while running hardhat coverage --matrix, check if hardhat-coverage is installed correctly")
                    print("Error:", e.stderr)
                    sys.exit(1)

        with open(os.path.join(project_directory, "testMatrix.json")) as f:
                data = json.load(f)

        rows = []
        for contract, lines in data.items():
            for _, tests in lines.items():
                for test in tests:

                    rows.append({
                        "Contract_id": contract.split('/')[-1],
                        "TestName": test["title"],
                        "TestFile": test["file"]
                    })

        df = pd.DataFrame(rows)
        
        df = df[["Contract_id","TestFile"]]
        df = df.drop_duplicates()
        df.to_csv(os.path.join(project_directory,'testMapping.csv'), index=False)
        mutants_dataset = pd.read_csv(datasetPath)
        print(' ## adding corresponding test cases to mutants')
        for index, row in mutants_dataset.iterrows():
             Contract_id = row["Contract_id"]
             testFiles = df[df['Contract_id'] == Contract_id]
             if not testFiles.empty:
                  testPath = os.path.join(project_directory, "sumo", "baseline", testFiles.iloc[0,1])
                  
                  with open(testPath, 'r') as file:
                        testCode = file.read()
                  mutants_dataset.at[index,"initial_test"]=testCode.replace('\n', ' ')

        mutants_dataset.to_csv(datasetPath, index=False)    
        print("# added initial test cases to dataset")
        # rename the folder of the tests to original_tests: it contains the test 
        if not os.path.exists(os.path.join(project_directory,'original_tests')):
            os.rename(os.path.join(project_directory, "test"), os.path.join(project_directory,'original_tests'))
            # Create a new folder for tests
            os.mkdir(os.path.join(project_directory, "test"))


def send_prompt_to_llm(prompt):
    try:
        url = "http://ec2-3-138-86-190.us-east-2.compute.amazonaws.com:8000/v1/completions"
        headers = {"Content-Type": "application/json"}
        data = {
            "model": "meta-llama/Meta-Llama-3-8B-Instruct",
            "prompt": prompt,
            "max_tokens": 500
        }
        
        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
                response_json = response.json()
                # Extract the generated text from the response
                if 'choices' in response_json and len(response_json['choices']) > 0:
                    generated_text = response_json['choices'][0]['text']
                    return generated_text
                else:
                    print("No choices found in the response.")
                    return None
        else:
            print(f"An error occurred: {response.text}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    

def send_prompt_to_openai(prompt):

    try :
        client = OpenAI(api_key=my_openai_key)

        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "Start chat."},
                      {"role": "user", "content": prompt}],
            stream=True,
        )
        response = ""
        for chunk in stream:
            response += chunk.choices[0].delta.content or ""
        print("this is the response received from openai", response)
        return response
    except Exception as e :
        print(f"An error occurred: {e}")
        return None


def promptGenerator(prompt_file_path, elements):
    if len(elements)==3:
        contract_code, mutant_code, testcases = elements

        with open(prompt_file_path, 'r') as file:
            prompt_template = file.read()

        prompt = prompt_template.format(
            contract_code=contract_code,
            mutant_code=mutant_code,
            testcases=testcases
        )
        
        return prompt
    elif len(elements)==4:
        contract_code, mutant_code, testcases ,error= elements
        with open(prompt_file_path, 'r') as file:
            prompt_template = file.read()

        prompt = prompt_template.format(
            error=error,
            contract_code=contract_code,
            mutant_code=mutant_code,
            buggy_testcases=testcases
        )
        
        return prompt

def extractTestCode(text):
    start_marker = "```javascript"
    end_marker = "```"
    start_index = text.find(start_marker)
    end_index = text.find(end_marker, start_index + 1)
    if start_index == -1 or end_index == -1:
        print("JavaScript code not found.")
        return

    js_code = text[start_index + len(start_marker):end_index].strip()

    js_code_lines = js_code.splitlines()
    js_code = '\n'.join(js_code_lines)

    return js_code




## create a prompt and send it to openai, read the generated test, if it compiles correctly
## it is putted in corrected tests, if not we redo another prompt which contains the execution error
## of the previous created test, 
# we repeat the loop "loopSize" times
def createTest(projectFolder, dataset , Mutant_id, initial_generation, generated_tests, generated_prompts, error_tests, corrected_tests):
     
    #  testFolder_correct = os.path.join(current_directory, "corrected_tests")
    #  if not os.path.exists(testFolder_correct):
    #         os.makedirs(testFolder_correct, exist_ok=True)
     correct_test =False
     count = 0
    #  Mutant_id =prioritized_mutant['Mutant_id']
     print (f"****** {Mutant_id} ******** " )

     
     while not correct_test and count<loopSize:
        # prioritized_mutant= dataset.loc[dataset['Mutant_id']==Mutant_id]
        prioritized_mutant = dataset.loc[dataset['Mutant_id'] == Mutant_id].iloc[0]
        if initial_generation:
            prompt = promptGenerator(template_initialTest_prompt, [prioritized_mutant["Contract_code"] , prioritized_mutant["Details"] , prioritized_mutant["initial_test"] ]) 
            
        else :

            prompt = promptGenerator(template_correctTest_prompt, [prioritized_mutant["Contract_code"] , prioritized_mutant["Details"] , prioritized_mutant["Generated_test"] ,  prioritized_mutant["Test_errors"] ])   

        prompt_file_path=os.path.join(generated_prompts,f"prompt_{prioritized_mutant['Mutant_id']}.txt")
    
        with open(prompt_file_path, 'w') as file:
    # Write the text to the file
                file.write(prompt)
        
        print(f"mutant {Mutant_id} :  sending prompt to llama for the time {count} ")

        # response = send_prompt_to_openai(prompt)
        response = send_prompt_to_llm(prompt)
        if response is not None :

            test_case = extractTestCode(response)
            if test_case is None:
                test_case=""

        else :
            test_case = ""

        print ("this is the generated test :  ", test_case)

        dataset.loc[dataset['Mutant_id'] == Mutant_id, 'Generated_test'] = test_case.replace("\n", " ")

        if initial_generation:
            testcase_file_path=os.path.join(generated_tests,f"test_{prioritized_mutant['Mutant_id']}.js")
            initial_generation = False        
        else :
            testcase_file_path=os.path.join(error_tests,f"test_{prioritized_mutant['Mutant_id']}.js")

        with open(testcase_file_path, 'w') as file:
                file.write(test_case)

        failedTest = runTest(projectFolder, testcase_file_path)
        if failedTest is not None and test_case != "" :
            if test_case != "":
                if len(failedTest)==0:
                    print("test executed correctly")
                    correct_test = True
                    # shutil.copy(testcase_file_path,os.path.join(projectPath, "test"))
                    shutil.copy(testcase_file_path,corrected_tests)
                    dataset.loc[dataset['Mutant_id'] == Mutant_id, 'Test_errors']= 'compiled correctly'
                    return True , test_case
                else :
                    dataset.loc[dataset['Mutant_id'] == Mutant_id, 'Test_errors'] = json.dumps(failedTest)
                    count = count + 1
            else :
                    dataset.loc[dataset['Mutant_id'] == Mutant_id, 'Test_errors'] = json.dumps("wrong test")
                    count = count + 1
                 
        else : 
            count = count + 1

     return correct_test, test_case

def run_hardhat_test(test_file_path, projectFolder):
    try:
        result = subprocess.run(["npx", "hardhat", "test", test_file_path], check=False, text=True, capture_output=True, cwd=projectFolder)
        return result.returncode == 0 ,  result.stderr

    except subprocess.CalledProcessError as e:
        print("An error occurred while running the test:")
        print(e.stderr)
        return False, e.stderr   
    


def runTest(projectFolder, testPath):

    ### check where the hardhat test will be executed and the where the awesomereport will be created
    success, err = run_hardhat_test(testPath, projectFolder)
    failed_tests = []
    mochatestFile = os.path.join(projectFolder,'mochawesome-report','test-results.json')
    correctTestExecution = os.path.isfile(mochatestFile)
    if not(success):

        if correctTestExecution:
            with open(mochatestFile, 'r') as file:
                    # Load the JSON data using json.load()
                    testing_report = json.load(file)
            if not(isinstance(testing_report["results"][0], bool)):        
                for result in testing_report["results"]: 
                    if "suites" in result :            
                        for suite in result["suites"]:
                            for test in suite["tests"]:
                                if test["state"] == "failed":
                                        failed_tests.append({
                                            "title": test["title"],
                                            "error": test["err"]["message"],
                                        })
                        else :
                             for test in result["tests"]:
                                if test["state"] == "failed":
                                        failed_tests.append({
                                            "title": test["title"],
                                            "error": test["err"]["message"],
                                        })
            else:
                failed_tests.append(err)

        else : 
            print("test did not execute correctly")
            # Extract specific error message
            error_lines = err.split('\n')
            specific_error = None
            for line in error_lines:
                if line.startswith("Error: "):
                    specific_error = line 
                    failed_tests.append(specific_error)
                    print("the mocha report did not create", specific_error)

        try:
            shutil.rmtree(os.path.join(projectFolder,'mochawesome-report'))
            print("mocha file has been removed successfully.")
        except FileNotFoundError:
            print("mocha does not exist.")
        if len(failed_tests)==0 :
             failed_tests.append("syntax error")
    
    return failed_tests

        
def launchExperiment(projectFolder, workspace , dataset_path):

    # dataset_path = os.path.join(current_directory, dataset_file)

    generated_tests = os.path.join(workspace,"generated_tests")
    generated_prompts = os.path.join(workspace,"generated_prompts")
    error_tests = os.path.join(workspace,"error_tests")
    corrected_tests = os.path.join(workspace,"corrected_tests")

    if not os.path.exists(generated_tests):
            os.makedirs(generated_tests)
    if not os.path.exists(generated_prompts):
            os.makedirs(generated_prompts)
    if not os.path.exists(error_tests):
            os.makedirs(error_tests)
    if not os.path.exists(corrected_tests):
            os.makedirs(corrected_tests)


    dataset = pd.read_csv(dataset_path)

    if 'TestGenerated' and 'KilledByTest' not in list(dataset.columns):
            
        dataset['TestGenerated'] = False
        dataset['KilledByTest'] = False

    df = dataset[(dataset["Status"] == "live") & (dataset['TestGenerated'] == False)]
 
    mutant_ids = df["Mutant_id"].tolist()
    
    mutants = mutant_ids[:mutantNbre]

    for mutant in mutants :

        testWorks, test_case = createTest(projectFolder,dataset , mutant, True,generated_tests, generated_prompts, error_tests, corrected_tests )

        dataset.loc[dataset['Mutant_id'] == mutant, 'TestGenerated'] = True
        df.loc[df['Mutant_id'] == mutant, 'TestGenerated'] = True
        dataset.loc[dataset['Mutant_id'] == mutant, 'LLM_Test'] = test_case.replace("\n", " ")
        if  testWorks:
            dataset.loc[dataset['Mutant_id'] == mutant, 'KilledByTest'] = True
            df.loc[df['Mutant_id'] == mutant, 'KilledByTest'] = True
        
    dataset.to_csv(dataset_path, index=False)

def setUpWorkspace(projectFolder):

    project_name = projectFolder.split('/')[-1]
    workspace = os.path.join(os.getcwd(), project_name)
    datasetPath= os.path.join(workspace, 'dataset_code.csv')
    
    if not os.path.exists(workspace):
            os.makedirs(workspace)
    
    return workspace, datasetPath

def main():
    parser = argparse.ArgumentParser(description='generate dataset and perform mutation testing.')
    parser.add_argument('projectFolder', type=str, help='path of your sumo folder in your project, sumo should be already installed')
    parser.add_argument('--create_dataset', action='store_true', help='create csv dataset containing the contract code and the mutation operations for each mutant')
    parser.add_argument('--add_initial_tests', action='store_true', help='add the the original test cases to the dataset')
    parser.add_argument('--launch_experiment', action='store_true', help='launch experiment for generating test cases to kill mutants')


    argcomplete.autocomplete(parser)

    args = parser.parse_args()

    # set up workspace
    workspace , datasetPath = setUpWorkspace(args.projectFolder)
    
    # Check if the provided path is a valid directory
    if not os.path.isdir(args.projectFolder):
        print(f"The provided path '{args.projectFolder}' is not a valid directory.")
        return

    elif args.create_dataset:
        create_dataset(args.projectFolder, datasetPath)

    elif  args.add_initial_tests:
        print("# adding the initial tests for each contract to the dataset")
        add_initial_tests(args.projectFolder, datasetPath)
            
    elif args.launch_experiment:
        print(f'## Running expermiment to generate testcases for {mutantNbre} mutants')
        launchExperiment(args.projectFolder, workspace, datasetPath)
         

if __name__ == '__main__':
    main()


