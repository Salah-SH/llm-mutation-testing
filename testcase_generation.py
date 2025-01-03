import time
import sys
import os
import csv
from openai import OpenAI
import argparse
import json
import numpy as np
import argcomplete
import pandas as pd
import subprocess
import shutil
from dotenv import load_dotenv
import requests
# workspace_path="../"
workspace_path=os.getcwd()
mutant_dataseet_path = "./mutants_code.csv"
current_directory=os.getcwd()
template_initialTest_prompt=os.path.join(current_directory,"prompt_templates","create_test_initial_prompt_template.txt")
template_correctTest_prompt=os.path.join(current_directory,"prompt_templates","fix_test_syntax_prompt_template.txt")

# You should set your OpenAI API key in the .env file
load_dotenv()
my_openai_key=os.getenv('OPENAI_APIKEY')

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
        print (error)
        with open(prompt_file_path, 'r') as file:
            prompt_template = file.read()

        prompt = prompt_template.format(
            error=error,
            contract_code=contract_code,
            mutant_code=mutant_code,
            buggy_testcases=testcases
        )
        
        return prompt



def executeTest(test_path, dataset_path):

    success, err = run_hardhat_test(test_path)

    failed_tests = []
    if not(success):
        with open(os.path.join(current_directory,'mochawesome-report','test-results.json'), 'r') as file:
                # Load the JSON data using json.load()
                testing_report = json.load(file)
        if not(isinstance(testing_report["results"][0], bool)):        
            for result in testing_report["results"]:                
                for suite in result["suites"]:
                    for test in suite["tests"]:
                        if test["state"] == "failed":
                                failed_tests.append({
                                    "title": test["title"],
                                    "error": test["err"]["message"],
                                })
        else:
            failed_tests.append(err)
        
    mutant_id=test_path.split("_")[-1].split('.')[0]
    df = pd.read_csv(dataset_path)
    if len(failed_tests)>0:
        df.loc[df['mutant_id'] == mutant_id, 'test_errors'] = json.dumps(failed_tests)
    else : 
        df.loc[df['mutant_id'] == mutant_id, 'test_errors'] = np.nan
        
    df.to_csv(dataset_path, index=False)   



# def send_prompt_to_llm(prompt):
#     try:
#         url = "http://localhost:8000/v1/completions"
#         headers = {"Content-Type": "application/json"}
#         data = {
#             "model": "meta-llama/Meta-Llama-3-8B-Instruct",
#             "prompt": prompt,
#             "max_tokens": 4000
#         }
        
#         response = requests.post(url, headers=headers, json=data)
        
#         if response.status_code == 200:
#             return response.json()
#         else:
#             print(f"An error occurred: {response.text}")
#             return None
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return None


def send_prompt_to_llm(prompt):
    try:
        url = "http://localhost:8000/v1/chat/completions"
        # url = "http://ec2-3-138-86-190.us-east-2.compute.amazonaws.com:8000/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer demo"
        }
        data = {
            "model": "llama3.1:8b",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            return response.json()
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
        return response
    except Exception as e :
        print(f"An error occurred: {e}")
        return None

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



def getAlltests():
        
        full_tests_dir = os.path.join(current_directory, "full_tests")
        corrected_tests_dir=  os.path.join(current_directory,"corrected_tests")
        initial_tests_dir=os.path.join(current_directory,"initial_tests")

        if not os.path.exists(full_tests_dir):
            os.makedirs(full_tests_dir, exist_ok=True)
            
        for filename in os.listdir(initial_tests_dir):
            source_file = os.path.join(initial_tests_dir, filename)
            destination_file = os.path.join(full_tests_dir, filename)
            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)

        for filename in os.listdir(corrected_tests_dir):
            source_file = os.path.join(corrected_tests_dir, filename)
            destination_file = os.path.join(full_tests_dir, filename)
            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)
        
        

    
def verify_alltests_correctness(dataset_path,generated_tests_dir):

    for filename in os.listdir(generated_tests_dir):
        print("execute test" , filename)
        executeTest(os.path.join(generated_tests_dir,filename), dataset_path)
    createTests(dataset_path, "correct_tests")
    getAlltests()



def execute_sumo_testing(path):
    copied_files = []
    initial_tests_dir=os.path.join(current_directory,"initial_tests")
    hardhat_tests_dir = "../test"

    for filename in os.listdir(initial_tests_dir):
        if filename.endswith('.js'):
            source_file = os.path.join(initial_tests_dir, filename)
            destination_file = os.path.join(hardhat_tests_dir, filename)
            shutil.copy(source_file, destination_file)
            copied_files.append(destination_file)

    result = subprocess.run(['npx','hardhat','test'], shell=True)

    if result.returncode == 0:
            print("Test passed successfully.")
            for file_path in copied_files:
                 if os.path.exists(file_path):
                     os.remove(file_path)
    else:
            print("Test failed.")


           
def createTests(dataset_path, flag):
    df = pd.read_csv(dataset_path)
    live_df = df[df['status'] == 'live']
    if flag=="correct_tests" :
        live_df= live_df[pd.notna(live_df["test_errors"])]
        folder_path = os.path.join(current_directory, "corrected_tests")
        if not os.path.exists(folder_path):
            os.makedirs(folder_path, exist_ok=True)

    else : 
        folder_path = os.path.join(current_directory, "initial_tests")
        if not os.path.exists(folder_path):
            os.makedirs(folder_path, exist_ok=True)

    for _, row in live_df.iterrows():
            if flag=="correct_tests" :
                
                prompt = promptGenerator(template_correctTest_prompt, [row["test_errors"], row["generated_tests"], row["mutant code"], row["contract code"]])   

            else :
                prompt = promptGenerator(template_initialTest_prompt, [row["contract code"], row["mutant code"], row["test"]])     
            
            print("sending prompt to llama", row["mutant_id"])
            # response = send_prompt_to_openai(prompt)
            response = send_prompt_to_llm(prompt)

            
            test_case = extractTestCode(response)

            if flag=="correct_tests" :
                df.loc[df['mutant_id'] == row['mutant_id'], 'correct tests'] = test_case
                testcase_file_path=os.path.join(current_directory, "corrected_tests",f"test_{row['mutant_id']}.js")

            else :
                df.loc[df['mutant_id'] == row['mutant_id'], 'generated_tests'] = test_case
                testcase_file_path=os.path.join(current_directory, "initial_tests",f"test_{row['mutant_id']}.js")

            if test_case is None:
                test_case=""

            with open(testcase_file_path, 'w') as file:
                file.write(test_case)

  
    df.to_csv(dataset_path, index=False)   

def runSumoTesting():

    execute_mutationTesting_command = ["npx", "sumo", "test"]
    generated_tests_dir=os.path.join(current_directory,"full_tests")
    sumoTests=os.path.join(os.path.dirname(current_directory),"test")

    for filename in os.listdir(generated_tests_dir):
            source_file = os.path.join(generated_tests_dir, filename)
            destination_file = os.path.join(sumoTests, filename)
            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)
    try:
        print("executing mutation testing using sumo")
        execution = subprocess.run(execute_mutationTesting_command, check=True, text=True, cwd=sumoTests)
    except subprocess.CalledProcessError as e:
        print("An error occurred while executing the mutation testing .")
        print("Error:", e.stderr)
        sys.exit()



def add_tests(dataset_path, testPath):
    print("here")

    with open(testPath, 'r') as js_file:
        js_content = js_file.read().strip()

    df = pd.read_csv(dataset_path)

    df['test'] = js_content

    df.to_csv(dataset_path, index=False)

##pre requist: need to have testMatrix.json generated using npx hardhat coverage --matrix
# maps every testfile to the smart contract its testing 
def add_initial_tests():
        solc_command = ["npx", "hardhat", "coverage","--matrix"]
        # try:
        #         print(f"Executing npx hardhat coverage ")
        #         subprocess.run(solc_command, check=True, text=True)
        #         print(f"Completed:")
        # except subprocess.CalledProcessError as e:
        #         print(f"An error occurred.")
        #         print("Error:", e.stderr)
        #         sys.exit(1)
        workspace_path = "../"
        with open(os.path.join(workspace_path, "testMatrix.json")) as f:
                data = json.load(f)

        rows = []
        for contract, lines in data.items():
            for line, tests in lines.items():
                for test in tests:
                    rows.append({
                        "contract_id": contract.split('/')[-1],
                        "testName": test["title"],
                        "testFile": test["file"]
                    })

        df = pd.DataFrame(rows)
        
        df = df[["contract_id","testFile"]]
        df = df.drop_duplicates()
        counts_tests = df.groupby('contract_id').size().to_dict()
        df.to_csv('testMapping.csv', index=False)
        
        mutants_dataset = pd.read_csv(mutant_dataseet_path)
        for index, row in mutants_dataset.iterrows():
             contract_id = row["contract_id"]
             testFiles = df[df['contract_id'] == contract_id]
             if not testFiles.empty:
                  testPath = os.path.join(workspace_path, "sumo", "baseline", testFiles.iloc[0,1])
                  print('testpath', testPath)
                  with open(testPath, 'r') as file:
                        testCode = file.read()
                  mutants_dataset.at[index,"initial_test"]=testCode

        mutants_dataset.to_csv(mutant_dataseet_path, index=False)    

        os.rename(os.path.join(workspace_path, "test"), os.path.join(workspace_path,'test_origin'))

        # Create a new folder for tests
        os.mkdir(os.path.join(workspace_path, "test"))

def select_mutant(dataset):
     highest_mutant_ranking= dataset.loc[dataset['predictedProbKillsDom'].idxmax()]
     return highest_mutant_ranking


def run_hardhat_test(test_file_path):
    try:
        result = subprocess.run(["npx", "hardhat", "test", test_file_path], check=False, text=True, capture_output=True)
        print("thus is the test execution")
        return result.returncode == 0 ,  result.stderr

    except subprocess.CalledProcessError as e:
        print("An error occurred while running the test:")
        print(e.stderr)
        return False, e.stderr   
    






def runTest(testPath):
    success, err = run_hardhat_test(testPath)
    # print("this is test path", testPath, err, success)
    failed_tests = []
    mochatestFile = os.path.join(current_directory,'mochawesome-report','test-results.json')
    correctTestExecution = os.path.isfile(mochatestFile)
    print("mocha report created : ", correctTestExecution)
    if not(success):

        if correctTestExecution:
            with open(mochatestFile, 'r') as file:
                    # Load the JSON data using json.load()
                    testing_report = json.load(file)
            if not(isinstance(testing_report["results"][0], bool)):        
                for result in testing_report["results"]: 
                    print("this is reeukts", result)   
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
            # Extract specific error message
            error_lines = err.split('\n')
            specific_error = None
            for line in error_lines:
                if line.startswith("Error: "):
                    specific_error = line 
                    failed_tests.append(specific_error)
                    print("the mocha report did not create", specific_error)

        try:
            shutil.rmtree(os.path.join(current_directory,'mochawesome-report'))
            print("mocha file has been removed successfully.")
        except FileNotFoundError:
            print("mocha does not exist.")
        print("htis is the failed test  :", failed_tests)
        if len(failed_tests)==0 :
             failed_tests.append("syntax error")
    
    return failed_tests
    # if len(failed_tests)>0:
    #         df.loc[df['mutant_id'] == mutant_id, 'test_errors'] = json.dumps(failed_tests)
    # else : 
    #         df.loc[df['mutant_id'] == mutant_id, 'test_errors'] = np.nan
     

def createTest(dataset , prioritized_mutant, initial_generation):
     
     testFolder_correct = os.path.join(current_directory, "corrected_tests")
     if not os.path.exists(testFolder_correct):
            os.makedirs(testFolder_correct, exist_ok=True)
     correct_test =False
     
     count = 0
     mutant_id =prioritized_mutant['mutant_id']
     print (f"****** {mutant_id} ******** " )
     

     countMax = 20
     while not correct_test and count<countMax:
        # prioritized_mutant= dataset.loc[dataset['mutant_id']==mutant_id]
        prioritized_mutant = dataset.loc[dataset['mutant_id'] == mutant_id].iloc[0]
        if initial_generation:
            prompt = promptGenerator(template_initialTest_prompt, [prioritized_mutant["contract_code"] , prioritized_mutant["details"] , prioritized_mutant["initial_test"] ]) 
            initial_generation = False
            
        else :
            prompt = promptGenerator(template_correctTest_prompt, [prioritized_mutant["contract_code"] , prioritized_mutant["details"] , prioritized_mutant["generated_test"] ,  prioritized_mutant["test_errors"] ])   

        prompt_file_path=os.path.join(current_directory, "generated_tests",f"prompt_{prioritized_mutant['mutant_id']}.txt")
    
        with open(prompt_file_path, 'w') as file:
    # Write the text to the file
                file.write(prompt)
        
        print("sending prompt to llama for the time i ", count, mutant_id )

        response = send_prompt_to_openai(prompt)
        if response is not None :

            test_case = extractTestCode(response)
            if test_case is None:
                test_case=""

        else :
            test_case = ""

        print ("this is the generated test   :", test_case)
        dataset.loc[dataset['mutant_id'] == mutant_id, 'generated_test'] = test_case
        if initial_generation:
            prompt_file_path=os.path.join(current_directory, "generated_tests",f"prompt_{prioritized_mutant['mutant_id']}.txt")

            testcase_file_path=os.path.join(current_directory, "generated_tests",f"test_{prioritized_mutant['mutant_id']}.js")
        else :
            prompt_file_path=os.path.join(current_directory, "error_tests",f"prompt_{prioritized_mutant['mutant_id']}.txt")

            testcase_file_path=os.path.join(current_directory, "error_tests",f"test_{prioritized_mutant['mutant_id']}.js")

            


        with open(testcase_file_path, 'w') as file:
                file.write(test_case)
        failedTest = runTest(testcase_file_path)
        print ("******", failedTest)
        if failedTest is not None:
            if len(failedTest)==0:
                correct_test = True
                shutil.copy(testcase_file_path,os.path.join(workspace_path, "test"))
                shutil.copy(testcase_file_path,testFolder_correct)
                return testcase_file_path
            else :
                dataset.loc[dataset['mutant_id'] == mutant_id, 'test_errors'] = json.dumps(failedTest)
                count = count + 1
        else : 
            count = count + 1
                
        if count==countMax  : 
             prior_mutant =dataset.loc[dataset['mutant_id']==mutant_id].iloc[0]

     print("is this test working ?", correct_test)
     return correct_test



def launchExperiment():
    dataset_path = os.path.join(workspace_path,'final_dataset.csv')

    if not os.path.exists("generated_tests"):
            os.makedirs("generated_tests")
    df= pd.read_csv("./predictions_Allobase.csv")
    # mutant_dataset = pd.read_csv(mutant_dataseet_path)
    # dataset_merged = pd.merge(df, mutant_dataset, on="mutant_id", how="inner")
    # dataset_merged.to_csv(dataset_path, index=False)


    dataset = pd.read_csv(dataset_path)
    
        # dataset = pd.read_csv(dataset_path)
    
    dataset['testgenerated'] = False
    dataset['killedbytest'] = False
    df = dataset[dataset["Status"]=="live"]
    ##we insert a lign here 
    df.to_csv("live.csv", index=False)    
    ## end of insert
    for i in range(50) :
        print("this is the iteration number :", i)
        df =df[df['testgenerated'] == False] 
        prioritizedMutant = select_mutant(df)
        priot_mutant_id = prioritizedMutant["mutant_id"]


        testWorks = createTest(dataset , prioritizedMutant, True)

        dataset.loc[dataset['mutant_id'] == priot_mutant_id, 'testgenerated'] = True
        df.loc[df['mutant_id'] == priot_mutant_id, 'testgenerated'] = True

        if  testWorks:
            dataset.loc[dataset['mutant_id'] == priot_mutant_id, 'killedbytest'] = True
            df.loc[df['mutant_id'] == priot_mutant_id, 'killedbytest'] = True


    
    
    # if len(testfile_path)==0:
    #       dataset.loc[dataset['mutant_id'] == prioritizedMutant["mutant_id"], 'predictedProbKillsDom'] = -1


     
     




def main ():
    parser = argparse.ArgumentParser(description='generate tests')
    # parser.add_argument('path', type=str, help='Path of your created dataset. if not you should create it using script generate_mutants_dataset.')
    parser.add_argument('--create_tests', action='store_true', help='Create test for each surviving mutant')
    parser.add_argument('--verify_tests', action='store_true', help='Verify the correct execution of all the test')
    parser.add_argument('--runSumoTesting', action='store_true', help='run sumo testing using the generated tests')
    parser.add_argument('--add_initial_tests', action='store_true', help='add the original dataset saved in all_initial_tests.js to the dataset')
    parser.add_argument('--launch_experiment', action='store_true', help='lauch experiment')

    
    argcomplete.autocomplete(parser)
    args = parser.parse_args()

    # if not os.path.isfile(args.path) or not args.path.endswith('.csv'):
    #     print(f"The provided path '{args.path}' is not a valid CSV file path.")
    #     return
    
    if args.add_initial_tests:
        print("## adding the initial tests for each contract to the dataset")
        add_initial_tests()
        
        # add_tests(args.path, os.path.join(current_directory,"all_initial_tests.js"))
    
    if args.launch_experiment:
        test_caseipath = launchExperiment()
         
    
    
    if args.create_tests:
        createTests(args.path,"create_tests")
    if args.verify_tests:
        verify_alltests_correctness(args.path, os.path.join(current_directory,"initial_tests"))
    if args.runSumoTesting:
        runSumoTesting()


    



if __name__ == '__main__':
    main()


