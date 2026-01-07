# GitHub Pages 部署指南

## 方法一：通过 Git 命令行部署（推荐）

### 步骤：

1. **初始化 Git 仓库**
```bash
cd c:/Users/刘畅/CodeBuddy/20260107180521
git init
git add .
git commit -m "初始提交：秋风断情丝音乐播放器"
```

2. **在 GitHub 创建新仓库**
   - 访问 https://github.com/new
   - 仓库名称：`music-player`（或任意名称）
   - 设置为 Public（公开）
   - 不要勾选任何初始化选项
   - 点击 Create repository

3. **推送代码到 GitHub**
```bash
git remote add origin https://github.com/你的用户名/music-player.git
git branch -M main
git push -u origin main
```

4. **启用 GitHub Pages**
   - 进入仓库的 Settings（设置）
   - 左侧菜单找到 Pages
   - Source 选择 `main` 分支
   - 文件夹选择 `/ (root)`
   - 点击 Save

5. **等待部署完成**
   - 大约 1-2 分钟后，会显示访问链接
   - 链接格式：`https://你的用户名.github.io/music-player/`

---

## 方法二：通过 GitHub 网页上传（更简单）

### 步骤：

1. **在 GitHub 创建新仓库**
   - 访问 https://github.com/new
   - 仓库名称：`music-player`
   - 设置为 Public
   - 点击 Create repository

2. **上传文件**
   - 在仓库页面点击 "uploading an existing file"
   - 将以下文件拖拽到页面中：
     - index.html
     - style.css
     - script.js
     - 秋风断情丝.mp3
     - README.md
   - 填写提交信息：`初始提交`
   - 点击 Commit changes

3. **启用 GitHub Pages**
   - 进入 Settings → Pages
   - Source 选择 `main` 分支
   - 点击 Save

4. **访问网站**
   - 等待 1-2 分钟
   - 访问显示的链接

---

## 注意事项

⚠️ **重要**：
- 仓库必须设置为 Public（公开）才能使用免费的 GitHub Pages
- MP3 文件会被上传，确保文件大小不超过 100MB
- 第一次部署可能需要几分钟才能访问

✅ **部署成功后**：
- 你将获得一个永久的网址
- 可以分享给朋友在线听歌
- 每次修改代码后，重新 push 即可自动更新

---

## 更新网站

如果需要修改代码：

```bash
# 修改文件后
git add .
git commit -m "更新说明"
git push
```

等待 1-2 分钟，网站会自动更新。
