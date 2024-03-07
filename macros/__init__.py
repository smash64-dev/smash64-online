#!/usr/bin/env python3

from .admonition import Admonition
from .button import Button
from .micromodal import MicroModal
from .patcher import Patcher


# pylint: disable=invalid-name
def define_env(env):
    #
    # admonitions macros
    #
    @env.macro
    def admonition(**kwargs):
        return Admonition(env=env, **kwargs)

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
    def beta(thing: str = 'page'):
        return Admonition(
            env=env,
            style='info',
            title='Beta',
            message=(f"The following {thing} is still in beta. It *should* "
                     'work for the most part, but it is not the final '
                     'version. If it does not work, no support will be '
                     'provided.'),
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

    #
    # button macros
    #
    @env.macro
    def button(text: str = '', **kwargs):
        return Button(env=env, text=text, **kwargs)

    #
    # error macros
    #
    @env.macro
    def exception(message: str):
        raise Exception(message)    # pylint: disable=broad-exception-raised

    #
    # modal macros
    #
    @env.macro
    def modal(title: str, **kwargs):
        return MicroModal(env=env, title=title, **kwargs)

    @env.macro
    def modalId(title: str):
        return MicroModal(env=env, title=title).id

    @env.macro
    def modalOk(title: str, body: str, **kwargs):
        if 'confirm' not in kwargs:
            kwargs['confirm'] = Button(env, text='Ok')

        trigger = MicroModal.config(env, 'closeTrigger', MicroModal.CLOSE)
        kwargs['confirm'].attributes.append(trigger)
        kwargs['confirm'].primary = True
        return MicroModal(env=env, title=title, body=body, **kwargs).render()

    @env.macro
    def modalOkCancel(title: str, body: str, **kwargs):
        if 'confirm' not in kwargs:
            kwargs['confirm'] = Button(env, text='Ok')
        if 'dismiss' not in kwargs:
            kwargs['dismiss'] = Button(env, text='Cancel')

        trigger = MicroModal.config(env, 'closeTrigger', MicroModal.CLOSE)
        kwargs['confirm'].primary = True
        kwargs['dismiss'].attributes.append(trigger)
        kwargs['dismiss'].primary = False
        return MicroModal(env=env, title=title, body=body, **kwargs).render()

    #
    # patcher macros
    #
    @env.macro
    def patcher(**kwargs):
        return Patcher(env=env, **kwargs)
# pylint: enable=invalid-name
