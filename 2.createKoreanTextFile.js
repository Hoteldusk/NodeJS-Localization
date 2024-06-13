const fs = require("fs");

// 파일 삭제 함수
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
    //   console.error(`파일 삭제 중 오류 발생: ${err}`);
    } else {
      // console.log(`파일이 성공적으로 삭제되었습니다: ${filePath}`);
    }
  });
}

// 파일을 읽어 변수에 저장하는 함수
function readFileIntoVariable(filePath) {
  try {
    // 파일을 동기적으로 읽음
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent;
  } catch (err) {
    console.error(`파일을 읽는 동안 오류가 발생했습니다: ${err}`);
    return null;
  }
}

// 한글 문자를 추출
function extractKoreanCharacters(inputString) {
    const koreanCharacters = inputString.match(/[\u3131-\uD79D]+[\s\u3131-\uD79D]*/gu);
  
    if (koreanCharacters) {
      return koreanCharacters;
    } else {
      return '';
    }
}

// 메인 동작 부분
function mainLogic() {
  // 디렉토리와 경로파일 가져오기
const filePaths = [];


const fileContent = fs.readFileSync('fileLists.txt', 'utf8');
const lines = fileContent.split('\n');
lines.forEach(filePath => {
    filePaths.push(filePath);
});


// 한글|경로|라인수 저장될 파일 경로
const outputKoreanLineFilePath = "kor.txt";
deleteFile(outputKoreanLineFilePath);

// 중복제거되고 정렬된 한글 저장할 파일 경로
const outputKoreanLineFilePath2 = "korList.txt";
deleteFile(outputKoreanLineFilePath2);

// 한글|경로|라인수 저장할 배열
const saveKoreanPathLineToTxtList = [];

// 중복제거를 위한 set (중복제거된 한글파일을 만들기 위함)
const koreanTextSet = new Set();


  // js, jsx 파일들 경로가 저장된 배열 탐색 시작
  console.log('kor파일의 생성시작');
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];

    // 경로로 접근해서 해당 파일의 내용을 변수에 저장
    const fileContents = readFileIntoVariable(filePath);

    if (fileContents !== null) {
      // 파일 내용을 줄바꿈 문자로 분리한 후 배열로 저장
      const fileContentsArray = fileContents.split("\n");

      // 현재 루프에서 라인수 파악이 가능함
      for (let i = 0; i < fileContentsArray.length; i++) {
        const line = fileContentsArray[i];
        // string 타입
        const koreanText = extractKoreanCharacters(line);
        
        if (koreanText.length > 0) {
          
          koreanText.forEach((element) => {
            // 문자열 끝에있는 공백제거
            const koreanTextTrim = element.trim();

            // 한글:경로:라인수 형식으로 리스트에 저장 (kor 파일 생성)
            saveKoreanPathLineToTxtList.push(`${koreanTextTrim}|${filePath}|${(i + 1)}`);

            // 중복을 제거해야되므로 set에 저장 (korList 파일생성 하기 위해서)
            koreanTextSet.add(koreanTextTrim);
          });
        }
      }
    } else {
      console.log("fileLists.txt 파일이 비어있습니다");
    }
  }
  // 텍스트 파일 저장
  fs.writeFileSync(outputKoreanLineFilePath, saveKoreanPathLineToTxtList.join('\n'));
  console.log('kor파일의 생성이 완료 되었습니다');

  // 중복이 제거된 set을 정렬된 배열로 변환
  const sortedKoreanArray = Array.from(koreanTextSet).sort((a, b) => a.localeCompare(b));

  // 정렬된 배열을 활용하여 korList 파일생성
  console.log('korList 파일의 생성시작');
  fs.writeFileSync(outputKoreanLineFilePath2, sortedKoreanArray.join('\n'));
  console.log('korList 파일의 생성이 완료 되었습니다');
}

mainLogic();