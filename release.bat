@echo off
set branch=%1
set mainBranch=%2

call npm install
rd /s /q "dist"
call npm run build

git add .
git reset --hard HEAD
call npm install
rd /s /q "dist"
call npm run build
git checkout %mainBranch%
git merge --squash %branch%
set /p isOk="手动修改版本进行提交:"
if "%isOk%"=="1" (
	git checkout %branch%
	git merge --no-edit %mainBranch%
)

set /p isOk="解决冲突:"
if "%isOk%"=="1" (
	git checkout %mainBranch%
	echo username: zj0724
    echo password: June3259123
    echo email:    1476253236@qq.com
@REM     call npm login
    call npm publish
	git checkout %branch%
)
