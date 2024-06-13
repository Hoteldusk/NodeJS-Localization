const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// 입력값
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const outputKoreanLineFilePath = 'kor.txt';
deleteFile(outputKoreanLineFilePath);

const outputKoreanLineFilePath2 = 'korList.txt';
deleteFile(outputKoreanLineFilePath2);

const outputTransLatedFilePath = 'kor-eng.txt';
// deleteFile(outputTransLatedFilePath);

// 한글|경로|라인수 저장할 배열
const saveKoreanPathLineToTxtList = [];

// 한글|영어 저장할 맵(최초)
let translateMatchMap = createMapFromFile(outputTransLatedFilePath);
// const translateMatchMap = new Map();


// 현재 스크립트 파일의 디렉토리 경로를 가져옴
const currentDirectory = __dirname;
// 연결하려는 폴더 경로
const folderName = 'ToTransLate';
// 상대 경로 생성
const directoryPath = path.join(currentDirectory, folderName);

// const directoryPath = 'C:/Users/user/Documents/Node_WorkSpace/kor_eng/sample';
const files = getFilesRecursively(directoryPath);
console.log(files);


// 디렉토리를 검색하고 파일 리스트를 생성하는 재귀 함수
function getFilesRecursively(directory) {
  const filesList = [];

  // 디렉토리 내의 모든 항목을 읽음
  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    if (isDirectory) {
      // 현재 아이템이 디렉토리인 경우, 재귀적으로 함수를 호출하여 하위 디렉토리를 검색
      const subDirectoryFiles = getFilesRecursively(itemPath);
      filesList.push(...subDirectoryFiles);
    } else {
      // 현재 아이템이 파일인 경우, 파일 경로를 리스트에 추가
      if(itemPath.includes('.js') || itemPath.includes('.jsx'))filesList.push(itemPath);
    }
  });

  return filesList;
}

// console.log('모든 파일경로 리스트:');
// console.log(files);

// 파일 경로 리스트 저장 (1번째 파일 생성)
const outputfile_listFilePath = 'fileLists.txt';

fs.writeFileSync(outputfile_listFilePath, files.join('\n'));

console.log('파일 리스트가 저장되었습니다.');


// 파일 삭제 함수
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`파일 삭제 중 오류 발생: ${err}`);
    } else {
      // console.log(`파일이 성공적으로 삭제되었습니다: ${filePath}`);
    }
  });
}

// 파일을 읽어 변수에 저장하는 함수
function readFileIntoVariable(filePath) {
  try {
    // 파일을 동기적으로 읽음
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (err) {
    console.error(`파일을 읽는 동안 오류가 발생했습니다: ${err}`);
    return null;
  }
}

// 한글:경로:라인수 파일에 저장
function saveKoreanPathLineToTxt(korean, path, lineCount, filePath) {
  const content = `${korean}|${path}|${lineCount}\n`;
  saveKoreanPathLineToTxtList.push(`${korean}|${path}|${lineCount}`);
  try {
    fs.appendFileSync(filePath, content);
    // console.log('파일이 성공적으로 저장되었습니다.');
  } catch (err) {
    console.error('파일을 저장하는 동안 오류가 발생했습니다:', err);
  }
}

// 정렬해서 한글만 저장
function saveKoreanPathLineToTxt2(korean, filePath) {
  const content = `${korean}\n`;
  
  try {
    fs.appendFileSync(filePath, content);
    // console.log('파일이 성공적으로 저장되었습니다.');
  } catch (err) {
    console.error('파일을 저장하는 동안 오류가 발생했습니다:', err);
  }
}

// 여기서 Map을 순회해서 텍스트 파일에 저장을 해야함 (한글|영어)
function saveTranslateToTxt(filePath) {

  try {
    fs.writeFileSync(filePath, '');
    console.log('파일 내용이 성공적으로 지워졌습니다.');
  } catch (err) {
    console.error('파일 내용을 지우는 동안 오류가 발생했습니다:', err);
  }

  translateMatchMap.forEach((value, key) => {
    // console.log(`${key}: ${value}`);
    const content = `${key}|${value}`;
      try {
        fs.appendFileSync(filePath, content);
        // console.log('파일이 성공적으로 저장되었습니다.');
      } catch (err) {
        console.error('파일을 저장하는 동안 오류가 발생했습니다:', err);
      }
  });
  console.log("한글 대응 단어장이 저장되었습니다");
}


async function mainLogic() {
  // const koreanTextList = [];
  // 중복제거를 위한 set
  const koreanTextSet = new Set();

  // kor.txt 파일 생성
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const fileContents = readFileIntoVariable(filePath);
    
    if (fileContents !== null) {
      // 파일 내용을 줄바꿈 문자로 분리한 후 배열로 저장
      const fileContentsArray = fileContents.split('\n');
      
      // 현재 루프에서 라인수 파악이 가능함
      for (let i = 0; i < fileContentsArray.length; i++) {
        const line = fileContentsArray[i];
        
        // string 타입
        const koreanText = extractKoreanCharacters(line);
        
        
        // console.log(koreanText);

        if(koreanText.length > 0) {
          // console.log('test');
          koreanText.forEach(element => {
            // 문자열 끝에있는 공백제거
            const koreanTextTrim = element.trim();
            // 한글:경로:라인수 형식으로 파일에 저장 (2번째 파일 생성)
            saveKoreanPathLineToTxt(koreanTextTrim, filePath, (i+1), outputKoreanLineFilePath);
            // (koreanText를 활용해야하니 set에 저장)
            
            koreanTextSet.add(koreanTextTrim);
          });
        }
      }
    }
  }


  
  // korList, kor-eng 파일 생성(TODO: 로직 교체 필요)
  const sortedKoreanArray = Array.from(koreanTextSet).sort((a, b) => a.localeCompare(b));
  console.log(sortedKoreanArray);

  for (let index = 0; index < sortedKoreanArray.length; index++) {

    const koreanText = sortedKoreanArray[index];
    saveKoreanPathLineToTxt2(koreanText, outputKoreanLineFilePath2);

    // 처음에 파일을 불러온 map에서 해당되는 값이 있는지 검사 있으면 
    const findKey = translateMatchMap.get(koreanText);
    // console.log("findKey : " + findKey);
    if (findKey !== undefined) {
      console.log('파일에 이미 존재하는 값입니다 : ' + koreanText);
    } else {
      let translateText = await pythonTranslate(koreanText);
      translateText = translateText.split(' ').join('_');

      console.log(sortedKoreanArray.length + "개 중 " + (index+1) + "번째 번역"+ "   " + koreanText + "   " + translateText);
      translateMatchMap.set(koreanText, translateText);
    }
  }
  const translateMatchMaptoArray = Array.from(translateMatchMap);
      // 2. 배열을 특정 기준으로 정렬 (예: 키(key)를 기준으로 정렬)
  translateMatchMaptoArray.sort((a, b) => {
    // 오름차순으로 정렬 (내림차순으로 하려면 b와 a를 바꾸세요)
    return a[0].localeCompare(b[0]);
  });

  translateMatchMap = new Map(translateMatchMaptoArray);
  console.log("map size : " + translateMatchMap.size);
  saveTranslateToTxt(outputTransLatedFilePath);

  rl.question('번역을 합니까? (yes/no) ', (answer) => {
    console.log(`사용자 입력: ${answer}`);
    if(answer === 'yes') {
      rl.close();
      console.log("파일교체를 시작합니다");
      ReplaceFile(outputTransLatedFilePath);
    } else{
      rl.close();
      console.log('프로그램 종료');
    }
  });
}

// 한글 문자를 추출
function extractKoreanCharacters(inputString) {
  
  const koreanCharacters = inputString.match(/[\u3131-\uD79D]+[\s\u3131-\uD79D]*/gu);

  // console.log(koreanCharacters);

  // 추출된 문자열을 문자열로 결합
  if (koreanCharacters) {
    // console.log("koreancharacters 확인");
    // console.log(koreanCharacters);
    return koreanCharacters;
  } else {
    return '';
  }
}

// 파이썬 프로그램 실행 명령어와 인자 설정
async function pythonTranslate(koreanText) {
  // console.log(koreanText + "123");
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['translate.py', koreanText]);
    let translateText = "";
    
    // 파이썬 프로그램 출력을 화면에 출력
    pythonProcess.stdout.on('data', (data) => {
      // console.log(`파이썬 출력: ${data.toString()}`);
      translateText = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`에러 발생: ${data.toString()}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        // console.log('파이썬 프로그램 정상 종료');
        resolve(translateText);
      } else {
        console.error(`파이썬 프로그램 에러, 종료 코드: ${code}`);
        reject(`파이썬 프로그램 에러, 종료 코드: ${code}`);
      }
    });
  });
}

async function replaceTextInFile(findText, replaceText, filePath, fileLineNum) {
  try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const lines = data.split('\n');
    

      // console.log('변경  전    : ' + lines[fileLineNum - 1]);
      lines[fileLineNum - 1] = lines[fileLineNum - 1].replace(findText, replaceText);    
      const modifiedContent = lines.join('\n');
      await fs.promises.writeFile(filePath, modifiedContent, 'utf8');
      // console.log('변경 후   : ' + lines[fileLineNum - 1]);
      // console.log('파일이 성공적으로 수정되었습니다.');
  } catch (err) {
    console.error('파일 처리 중 오류가 발생했습니다:', err);
  }
}

// 한|영 파일을 읽어서 맵으로 저장시키는 함수
function createMapFromFile(filePath) {
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

// 배열(라인수, 경로, 한글), 맵(영어), 경로 데이터를 가지고 파일을 교체하는 함수
async function ReplaceFile(kor_engFilePath) {
  console.log("ReplaceFile method");
  const translateMap = createMapFromFile(kor_engFilePath);

  for (let i = 0; i < saveKoreanPathLineToTxtList.length; i++) {
    const koreanAndPath = saveKoreanPathLineToTxtList[i];
    const koreanAndPathSilced = koreanAndPath.split('|');
      
      
    const findText = koreanAndPathSilced[0];
    console.log("findText : " + findText);

      
    // 이부분에서 파일을 다시 읽는 방식으로 해야될듯
    const matchKoreaAndTrans = translateMap.get(findText);

    let replaceText = null;

    if(matchKoreaAndTrans.indexOf('\n')) {
      replaceText = matchKoreaAndTrans.trimEnd();
    } else {
      replaceText = matchKoreaAndTrans;
    }
    console.log("replaceText : " + replaceText);

    const path = koreanAndPathSilced[1];
    console.log("path : " + path);

    const fileLineNum = koreanAndPathSilced[2];

    if(replaceText != null) {
      await replaceTextInFile(findText, replaceText, path, fileLineNum);
      console.log('파일 수정중');
    }
  }
  console.log("파일 수정이 완료되었습니다");
}

mainLogic();