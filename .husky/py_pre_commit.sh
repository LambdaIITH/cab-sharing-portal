#!/usr/bin/env bash

# set -o nounset

# Original Author: Nikhil Pallamreddy (@npalladium)
# Prevent direct commits to main
##################################

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ]; then
    printf "You can't commit directly to master branch.\n"
    exit 1
fi

# Python Hooks
##############

PY_FILES_DIR="backend/"
PY_FILES_PATH="$(git rev-parse --show-toplevel)/$PY_FILES_DIR"

STAGED_PY_FILES=$(git diff --diff-filter=d --cached --name-only -- '*.py')
#STAGED_PY_FILES=$(git diff --diff-filter=d --cached --name-only $PY_FILES_PATH -- '*.py')
#retrieve all .py files that have been staged for the next commit

list_py_files() {
    printf "\nThe following Python files have been staged:\n"
    printf '%s\n' "${STAGED_PY_FILES[@]}"
    printf "\n"
}

correct_py_file_names() {
    STAGED_FILES=(${STAGED_PY_FILES[@]})
    for i in "${!STAGED_FILES[@]}"; do
        DATA=${STAGED_FILES[$i]}
        pattern=$PY_FILES_DIR
        DATA=${DATA/$pattern/}
        STAGED_FILES[$i]=$DATA
    done
}

run_black() {
    printf "Running black...\n"
    (cd "$PY_FILES_PATH" && poetry run black "${STAGED_FILES[@]}")
}

run_isort() {
    printf "Running isort...\n"
    (cd "$PY_FILES_PATH" && poetry run isort "${STAGED_FILES[@]}")
}

run_flake8() {
    printf "Running flake8...\n"
    (cd "$PY_FILES_PATH" && poetry run flake8 "${STAGED_FILES[@]}")
    FLAKE8_EXIT="$?"
    if [[ "${FLAKE8_EXIT}" == 0 ]]; then
        printf "\n\033[42mFLAKE8 SUCCEEDED\033[0m\n"
    else
        printf "\n\033[41mCOMMIT FAILED:\033[0m Fix flake8 errors and try again.\n"
        exit 1
    fi
}

run_mypy() {
    printf "Running mypy...\n"
    (cd "$PY_FILES_PATH" && poetry run mypy "${STAGED_FILES[@]}")
}

# we can check to see if this is empty
if [[ $STAGED_PY_FILES == "" ]]; then
    printf "\nNo Python Files to update.\n"
# otherwise we can do stuff with these changed go files
else
    list_py_files
    correct_py_file_names
    run_black
    run_isort
    run_flake8
    # run_mypy
    echo "${STAGED_PY_FILES[@]}" | xargs -I{} git add {}
fi
