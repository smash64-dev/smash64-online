#!/usr/bin/env python3

def define_env(env):
    @env.macro
    def noop():
        return None
