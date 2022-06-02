#!/usr/bin/env python3

from .admonition import Admonition


def define_env(env):
    @env.macro
    def advanced(thing: str = 'page'):
        return Admonition(
            env=env,
            style='danger',
            title='Dragons Ahead',
            message=(f"The following {thing} expects that you have some "
                     '**technical computer knowledge**. This site **is not '
                     'responsible** if you get stuck or break something. Few '
                     'people will be capable of helping you. You have been '
                     'warned.'),
        ).render()

    @env.macro
    def incomplete(thing: str = 'page'):
        return Admonition(
            env=env,
            style='warning',
            title='Incomplete',
            message=(f"This {thing} is **missing information** and considered "
                     'incomplete. Although the information may be correct, '
                     'it is not ready for public consumption, *especially* '
                     'not for new users.'),
        ).render()

    @env.macro
    def wanted(thing: str = 'page'):
        return Admonition(
            env=env,
            style='note',
            title='Placeholder',
            message=(f"This {thing} is planned but has not been written yet. "
                     'If you would like to help contribute and have a GitHub '
                     'account, you can submit a pull request for it '
                     f"[here]({env.page.edit_url})."),
        ).render()
