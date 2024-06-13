# Localization Program

# 사용법
1. ToTransLate 디렉토리로 번역할 파일을 옮겨준다 (번역이 덮어써지니 백업 필수)
2. 순차적으로 1번2번3번4번 메서드를 실행시킨다.

# 실행파일 설명

## 1.createFileList.js
- ToTransLate 에 담긴 파일들의 디렉토리 경로를 fileLists.txt에 저장

## 2.createKoreanTextFile.js
1. fileLists.txt 에 담긴 경로를 이용하여 파일내의 한글을 추출
2. 추출된 한글을 이용하여 한글|경로|라인수 형식으로 kor.txt 파일에 저장
3. 추출된 한글을 이용하여 중복이제거된 한글을 korList.txt 파일에 저장

## 3.translateAndcreateFile.js
- pip install googletrans==4.0.0-rc1 필요
- korList.txt 파일을 이용하여 파이썬 translate.py을 통해 번역한 후 vocabularyBook.txt 파일에 저장

## 4.replaceFile.js
- kor.txt 파일과 vocabulary.txt 파일을 이용하여 ToTransLate 폴더내의 한글들을 번역

## 기타
- 번역엔진 개선시 3번 모듈 수정, 번역 언어 변경시 파이썬 파일에서 언어변경

## 문제점
- 영어 -> 타언어 불가능(구조적 문제)
- 한글 -> 타언어시 주석까지 변경됨(정규식 처리로 개선가능)