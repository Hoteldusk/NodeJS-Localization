import googletrans

import sys

if len(sys.argv) != 2:
    print("Usage: python script.py arg1 arg2")
else:
    arg1 = sys.argv[1]


translator = googletrans.Translator()

# print(translator)
inStr1 = arg1
result1 = translator.translate(inStr1, dest='en', src='auto')
print(f"{result1.text}")

# inStr2 = 'I am happy'
# result2 = translator.translate(inStr2, dest='ko', src='auto')
# print(f"I am happy => {result2.text}")

# outStr = translator.translate(inStr, dest='en', src='auto')

# print('hello')
# print(f"{inStr} => {outStr.text}")
