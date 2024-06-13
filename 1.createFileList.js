const fs = require('fs');
const path = require('path');

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

        // if(itemPath.includes('.json'))filesList.push(itemPath);
      }
    });
  
    return filesList;
}

// 현재 스크립트 파일의 디렉토리 경로를 가져옴
const currentDirectory = __dirname;
// 연결하려는 폴더 경로
const folderName = 'ToTransLate';
// 상대 경로 생성
const directoryPath = path.join(currentDirectory, folderName);

const files = getFilesRecursively(directoryPath);
console.log(files);

const outputfile_listFilePath = 'fileLists.txt';
// fileList 파일 생성
fs.writeFileSync(outputfile_listFilePath, files.join('\n'));
console.log('파일 리스트가 저장되었습니다.');