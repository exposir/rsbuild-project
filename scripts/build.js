const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // 创建新的备份目录
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = `dist_backup_${timestamp}`;

  // 如果 dist 目录存在，创建备份
  if (fs.existsSync("dist")) {
    console.log(`正在创建备份: ${backupDir}`);
    copyDirectory("dist", backupDir);
  }

  // 运行 Rsbuild 构建
  console.log("开始 Rsbuild 构建...");
  execSync("rsbuild build", { stdio: "inherit" });

  // 将备份中的文件合并到新的 dist 目录
  if (fs.existsSync(backupDir)) {
    console.log("正在合并旧文件到新的 dist 目录...");
    mergeDirectories(backupDir, "dist");
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
        console.log(`保留旧文件: ${targetPath}`);
      } else {
        console.log(`文件已存在，跳过: ${targetPath}`);
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
