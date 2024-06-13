const fs = require('fs');
// 배열(라인수, 경로, 한글), 맵(영어), 경로 데이터를 가지고 파일을 교체하는 함수

// 현재 파일 하나를 열고 수정하고 파일을 닫고있어서 파일 하나를 열고 수정할거 다 수정하고 파일 닫는 식으로 바꿔야함
// 이중 배열 쓰면? [경로, [한글리스트], [라인수리스트]]
// 배열 처리 해줘야됨
// 1. kor.txt 파일 데이터 가져오기
// 2. 데이터치리


// 파일 교체함수
async function ReplaceFile(formattedList) {
  formattedList.forEach(formattedData => {
    const filePathIndex = 0;
    const korDataIndex = 1;
    const engDataIndex = 2;
    const fileLineIndex = 3;

    const filePath = formattedData[filePathIndex];
    const korDataList = formattedData[korDataIndex];
    const engDataList = formattedData[engDataIndex];
    const fileLineList = formattedData[fileLineIndex];

    const fileContents = readFileIntoVariable(filePath);

    const contentLines = fileContents.split('\n');
    // console.log(contentLines);
    for (let index = 0; index < korDataList.length; index++) {
      const korData = korDataList[index];
      const engData = engDataList[index];
      const contentLinesIndex = fileLineList[index] - 1;
      
      contentLines[contentLinesIndex] = contentLines[contentLinesIndex].replace(korData, engData);
    }
    // console.log(contentLines);
    fs.writeFileSync(filePath, contentLines.join('\n'));
  });

  console.log("번역파일로 교체가 완료되었습니다");
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

// 파일을 읽어 리스트에 저장하는 함수
function readFileIntoList(filePath) {
  try {
    // 파일을 동기적으로 읽음
    const fileContent = fs.readFileSync(filePath, "utf8");
    if (fileContent !== null) {

      const dataList = [];
  
      // 파일 내용을 줄바꿈 문자로 분리한 후 배열로 저장
      const fileContentsArray = fileContent.split("\n");
  
      fileContentsArray.forEach(line => {
        dataList.push(line);
      });
  
      return dataList;
    } else {
      console.log("파일이 비어있습니다");
    }

  } catch (err) {
    console.error(`파일을 읽는 동안 오류가 발생했습니다: ${err}`);
    return null;
  }
}

// 파일을 읽어 맵에 저장하는 함수
function readFileIntoMap(filePath) {
  console.log("createMapFromFile");
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const myMap = new Map();

  if (Array.isArray(lines)) {
    // console.log("lines : " + lines);
    // console.log(lines + "asd" + lines);
    lines.forEach(line => {
      const [key, value] = line.split('|');
      if(value != null) myMap.set(key, value);
    });
  }
  // console.log(myMap);
  return myMap;
}

// 한글|경로|라인수 로 저장되어있는 리스트를 [ [경로1, [ 한글리스트 ], [ 영어리스트 ], [라인수리스트] ], [경로2, [ 한글리스트 ], [ 영어리스트 ], [라인수리스트] ] ]로 변환
function changeDataFormatted(listData, mapData) {
  const result = [];

  listData.forEach((item) => {
    const [korean, path, lineCount] = item.split('|');
    const foundPathIndex = result.findIndex((entry) => entry[0] === path);
    const english = mapData.get(korean) || ""; // mapData에서 영어 번역을 찾고, 없으면 빈 문자열

    if (foundPathIndex === -1) {
      // 경로가 처음 나타났을 때
      result.push([path, [korean], [english], [lineCount]]);
    } else {
      // 이미 존재하는 경로인 경우
      result[foundPathIndex][1].push(korean);
      result[foundPathIndex][2].push(english);
      result[foundPathIndex][3].push(lineCount);
    }
  });

  return result;
}

// // 테스트
// function convertListToNestedArrays(list) {
//   const result = [];

//   list.forEach((item) => {
//     const [korean, path, lineCount] = item.split('|');
//     const foundPathIndex = result.findIndex((entry) => entry[0] === path);

//     if (foundPathIndex === -1) {
//       // 경로가 처음 나타났을 때 (경로가 처음 나타났을 경우를 처리하는 부분 foundPathIndex 가 -1인 경우는 현재 경로가 result 배열에 존재하지 않는 경우)

//       result.push([path, [korean], [lineCount]]);
//     } else {
//       // 이미 존재하는 경로인 경우
//       result[foundPathIndex][1].push(korean);
//       result[foundPathIndex][2].push(lineCount);
//     }
//   });

//   return result;
// }


async function mainLogic () {
  // korText 파일 불러와서 리스트에 저장
  const korTextFilePath = "kor.txt";
  const korTextFileList = readFileIntoList(korTextFilePath);
  // console.log(korTextFileList);

  // voca 파일 불러와서 맵에 저장
  const vocabularyBookFilePath = "vocabularyBook.txt";
  const vocabularyBookMap = readFileIntoMap(vocabularyBookFilePath);
  // console.log(vocabularyBookMap);

  // const array = convertListToNestedArrays(korTextFileList);
  // console.log(array);

  const formattedArray = changeDataFormatted(korTextFileList, vocabularyBookMap);
  console.log(formattedArray);

  ReplaceFile(formattedArray);
}

mainLogic();