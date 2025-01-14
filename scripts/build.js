const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BACKUP_DIR = "dist_backup";

try {
  // 运行 Rsbuild 构建
  console.log("开始 Rsbuild 构建...");
  execSync("rsbuild build", { stdio: "inherit" });

  // 如果 dist 目录存在，创建或更新备份
  if (fs.existsSync("dist")) {
    console.log(`正在创建/更新备份: ${BACKUP_DIR}`);
    if (fs.existsSync(BACKUP_DIR)) {
      // 如果备份目录已存在，先清空它
      fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    }
    copyDirectory("dist", BACKUP_DIR);
  }

  // 将备份中的文件合并回 dist 目录
  if (fs.existsSync(BACKUP_DIR)) {
    console.log("正在将备份文件合并回 dist 目录...");
    mergeDirectories(BACKUP_DIR, "dist");
  }

  console.log("构建和合并完成");
} catch (error) {
  console.error("发生错误：", error);
}

function mergeDirectories(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      mergeDirectories(sourcePath, targetPath);
    } else {
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`添加文件: ${targetPath}`);
      } else {
        console.log(`文件已存在: ${targetPath}`);
      }
    }
  }
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
