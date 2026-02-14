import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

function getAllFiles(directoryPath, collectedFiles = []) {
  const filesInDirectory = fs.readdirSync(directoryPath);

  filesInDirectory.forEach((fileName) => {
    const fullFilePath = path.join(directoryPath, fileName);

    if (fs.statSync(fullFilePath).isDirectory()) {
      collectedFiles = getAllFiles(fullFilePath, collectedFiles);
    } else if (/\.(ts|tsx|js|jsx)$/.test(fileName)) {
      collectedFiles.push(fullFilePath);
    }
  });

  return collectedFiles;
}

function removeComments(sourceCode) {
  let cleanedCode = "";
  let currentIndex = 0;

  while (currentIndex < sourceCode.length) {
    const currentChar = sourceCode[currentIndex];
    const nextChar = sourceCode[currentIndex + 1];

    if (currentChar === '"') {
      cleanedCode += currentChar;
      currentIndex++;
      while (
        currentIndex < sourceCode.length &&
        (sourceCode[currentIndex] !== '"' || sourceCode[currentIndex - 1] === "\\")
      ) {
        cleanedCode += sourceCode[currentIndex++];
      }
      if (currentIndex < sourceCode.length) cleanedCode += sourceCode[currentIndex++];
      continue;
    }

    if (currentChar === "'") {
      cleanedCode += currentChar;
      currentIndex++;
      while (
        currentIndex < sourceCode.length &&
        (sourceCode[currentIndex] !== "'" || sourceCode[currentIndex - 1] === "\\")
      ) {
        cleanedCode += sourceCode[currentIndex++];
      }
      if (currentIndex < sourceCode.length) cleanedCode += sourceCode[currentIndex++];
      continue;
    }

    if (currentChar === "`") {
      cleanedCode += currentChar;
      currentIndex++;
      while (
        currentIndex < sourceCode.length &&
        (sourceCode[currentIndex] !== "`" || sourceCode[currentIndex - 1] === "\\")
      ) {
        cleanedCode += sourceCode[currentIndex++];
      }
      if (currentIndex < sourceCode.length) cleanedCode += sourceCode[currentIndex++];
      continue;
    }

    if (currentChar === "/" && nextChar === "*") {
      const isJSDoc = sourceCode.substr(currentIndex, 3) === "/**";

      if (isJSDoc) {
        cleanedCode += currentChar;
        currentIndex++;
        continue;
      }

      currentIndex += 2;
      while (
        currentIndex < sourceCode.length &&
        !(sourceCode[currentIndex] === "*" && sourceCode[currentIndex + 1] === "/")
      ) {
        currentIndex++;
      }
      currentIndex += 2;
      continue;
    }

    if (currentChar === "/" && nextChar === "/") {
      let commentContent = "";
      currentIndex += 2;

      while (currentIndex < sourceCode.length && sourceCode[currentIndex] !== "\n") {
        commentContent += sourceCode[currentIndex++];
      }

      const trimmedComment = commentContent.trim();
      const isImportantDirective =
        trimmedComment.startsWith("eslint-") ||
        trimmedComment.startsWith("@ts-") ||
        trimmedComment.startsWith("prettier-ignore");

      if (isImportantDirective) {
        cleanedCode += "//" + commentContent;
      }

      if (currentIndex < sourceCode.length) cleanedCode += sourceCode[currentIndex++];
      continue;
    }

    cleanedCode += currentChar;
    currentIndex++;
  }

  const codeWithoutExcessiveBlankLines = cleanedCode.replace(/\n\s*\n\s*\n/g, "\n\n");

  return codeWithoutExcessiveBlankLines;
}

const projectRootPath = path.join(currentDirectory, "../../");
const sourceFilesPath = path.join(projectRootPath, "src");
const allSourceFiles = getAllFiles(sourceFilesPath);

allSourceFiles.forEach((filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const contentWithoutComments = removeComments(fileContent);
  fs.writeFileSync(filePath, contentWithoutComments);
});

console.log(`✅ Comentarios eliminados de ${allSourceFiles.length} archivos`);
