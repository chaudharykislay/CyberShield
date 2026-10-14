@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for Windows (Self-contained)
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL EnableExtensions EnableDelayedExpansion

SET "DIR=%~dp0"
SET "WRAPPER_JAR=%DIR%.mvn\wrapper\maven-wrapper.jar"
SET "MVN_VERSION=3.9.9"
SET "MVN_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MVN_VERSION%"
SET "MVN_CMD=%MVN_DIR%\bin\mvn.cmd"

IF EXIST "%MVN_CMD%" (
    CALL "%MVN_CMD%" %*
    EXIT /B %ERRORLEVEL%
)

ECHO Downloading Apache Maven %MVN_VERSION%...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$dest = Join-Path $env:TEMP 'apache-maven-%MVN_VERSION%-bin.zip'; " ^
  "$url = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MVN_VERSION%/apache-maven-%MVN_VERSION%-bin.zip'; " ^
  "New-Item -ItemType Directory -Force -Path '%USERPROFILE%\.m2\wrapper\dists' | Out-Null; " ^
  "Invoke-WebRequest -Uri $url -OutFile $dest; " ^
  "Expand-Archive -Path $dest -DestinationPath (Split-Path '%MVN_DIR%') -Force; " ^
  "Remove-Item $dest -Force;"

IF EXIST "%MVN_CMD%" (
    CALL "%MVN_CMD%" %*
    EXIT /B %ERRORLEVEL%
) ELSE (
    ECHO Error: Failed to setup Maven wrapper.
    EXIT /B 1
)
