const fs = require('fs');
const { spawn } = require('child_process');

const outputTransLatedFilePath = "vocabularyBook.txt";
const nDuplicatedKorTextFilePath = 'korList.txt';


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

// 한|영 파일을 읽어서 맵으로 저장시키는 함수 (파일 => 맵)
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

// 파이썬 프로그램 실행(단어 하나를 받아서 번역)
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

// 메인 로직
async function mainLogic() {
  // 1. 한글|영어 저장할 맵(이미 파일에 있는 단어를 번역하는걸 방지하기 위함) 생성
  let translateMatchMap = createMapFromFile(outputTransLatedFilePath);
  console.log(translateMatchMap);
  console.log('기존 단어장을 불러 왔습니다.')

  // 2. 번역을 하기위해 중복제거된 한글 텍스트 파일 불러오기
  const nDuplicatedKorTextList = [];
  const fileContents = readFileIntoVariable(nDuplicatedKorTextFilePath);

  if(fileContents !== "") {
    console.log("한글 파일을 불러오는 중");

    const koreanTexts = fileContents.split('\n');
    koreanTexts.forEach(koreanText => {
      nDuplicatedKorTextList.push(koreanText);
    });
    console.log("한글 파일을 불러왔습니다");
  } else if(fileContents === "") {
    // korList.txt 파일이 비어있을경우 로직종료
    console.log("한글 파일이 비어있습니다");
    return;
  }

  // 3. 번역(기존 단어장에 이미 중복되는 값이 있으면 번역을 하지않음) 후 맵에 저장
  let count = 0;
  for (const koreanText of nDuplicatedKorTextList) {

    const checkDuplicated = translateMatchMap.get(koreanText);

    if (checkDuplicated !== undefined) {
      console.log('파일에 이미 존재하는 값 : ' + koreanText);
    } else {
      console.log("들어온 값 : " + koreanText);
      let translateText = await pythonTranslate(koreanText);
      translateText = translateText.split(' ').join('_');

      console.log(nDuplicatedKorTextList.length + " : " + (count+1) + "번째 번역"+ "   " + koreanText + "   " + translateText);
      translateMatchMap.set(koreanText, translateText);
      count ++;
    }
  }

  // 4. 맵을 배열로 변환하여 정렬
  const translateMatchMaptoArray = Array.from(translateMatchMap);
  translateMatchMaptoArray.sort((a, b) => {
    // 오름차순으로 정렬 (내림차순으로 하려면 b와 a를 바꾸세요)
    return a[0].localeCompare(b[0]);
  });


  // 5. 정렬된 배열을 파일에 저장
  const fileContent = translateMatchMaptoArray.map(row => row.join('|').trimEnd());
  
  fs.writeFileSync(outputTransLatedFilePath, fileContent.join('\n'));

  console.log("kor-eng.txt 파일이 생성되었습니다");
}

mainLogic();