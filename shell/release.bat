@echo off

set branch=%1
set mainBranch=%2

cd %~dp0
cd ..
git checkout %mainBranch%
git merge --squash %branch%

:: ǰ�ò���
rd /s/q dist
call npm run build

set /p isOk="�ֶ��޸İ汾�����ύ:"
if "%isOk%"=="1" (
	git checkout %branch%
	git merge --no-edit %mainBranch%
)

set /p isOk="�����ͻ:"
if "%isOk%"=="1" (
    :: ���ò���
    call npm publish
	git checkout %branch%
)