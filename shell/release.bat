@echo off

set branch=%1
set mainBranch=%2

cd ..
git checkout %mainBranch%
git merge --squash %branch%

:: ǰ�ò���
call npm install
call npm run build

set /p isOk="�ֶ��޸İ汾�����ύ:"
if "%isOk%"=="1" (
	git checkout %branch%
	git merge --no-edit %mainBranch%
)

set /p isOk="�����ͻ:"
if "%isOk%"=="1" (
    :: ���ò���
	git checkout %mainBranch%
	echo username: zj0724
    echo password: June3259123
    echo email:    1476253236@qq.com
    call npm publish
	git checkout %branch%
)