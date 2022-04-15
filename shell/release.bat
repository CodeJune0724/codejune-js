@echo off

set branch=%1
set mainBranch=%2

cd ..
git checkout %mainBranch%
git merge --squash %branch%

:: 前置步骤
call npm install
call npm run build

set /p isOk="手动修改版本进行提交:"
if "%isOk%"=="1" (
	git checkout %branch%
	git merge --no-edit %mainBranch%
)

set /p isOk="解决冲突:"
if "%isOk%"=="1" (
    :: 后置步骤
	git checkout %mainBranch%
	echo username: zj0724
    echo password: June3259123
    echo email:    1476253236@qq.com
    call npm publish
	git checkout %branch%
)