#!/bin/bash
# Definition of the function
foo () {
  ls -l;
}

# Use the function locally
foo

# Execution of the function on the remote machine.
ssh user@host "$(declare -f foo);foo"
