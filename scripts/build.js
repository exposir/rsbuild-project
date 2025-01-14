const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // 备份当前的 dist 目录
  if (fs.existsSync("dist")) {
    fs.renameSync("dist", "dist_backup");
  }

  // 运行 Rsbuild 构建
  execSync("rsbuild build", { stdio: "inherit" });

  // 如果有备份，将旧文件合并到新的 dist 目录
  if (fs.existsSync("dist_backup")) {
    mergeDirectories("dist_backup", "dist");
    fs.rmSync("dist_backup", { recursive: true, force: true });
  }

  console.log("构建和合并完成");
} catch (error) {
  console.error("发生错误：", error);
  // 如果发生错误，恢复备份
  if (fs.existsSync("dist_backup") && !fs.existsSync("dist")) {
    fs.renameSync("dist_backup", "dist");
  }
}

function mergeDirectories(source, target) {
  // 如果目标目录不存在，创建它
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // 读取源目录中的所有项目
  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      // 如果是目录，递归合并
      mergeDirectories(sourcePath, targetPath);
    } else {
      // 如果是文件，检查是否已存在
      if (!fs.existsSync(targetPath)) {
        // 如果文件不存在于目标目录，复制它
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`保留旧文件: ${targetPath}`);
      } else {
        // 如果文件已存在，可以根据需要进行比较或其他操作
        console.log(`文件已存在，跳过: ${targetPath}`);
      }
    }
  }
}
