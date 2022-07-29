#!/usr/bin/env python3

from button import Button
import re


class MicroModal:
    CLOSE = 'data-micromodal-close'
    OPEN = 'data-micromodal-trigger'

    def __init__(self, env: dict,
                 id: str = '', title: str = '', body: str = '',
                 scrollable: bool = False, size: str = 'md', color: str = '',
                 confirm: Button = None, dismiss: Button = None,
                 buttons: list[Button] = []):
        self.env = env
        self.title = title
        self.body = body
        self.size = f"modal-dialog-{size}"
        self.color = color

        self.buttons = buttons + [
            dismiss if dismiss is not None else '',
            confirm if confirm is not None else '',
        ]

        can_scroll = self.scrollable(scrollable)
        self.dialog_class = f"modal-dialog {self.size} {can_scroll}"
        self.id = self.__safe_id(id) if id else self.__safe_id(title)

        close = self.config(env, 'closeTrigger', MicroModal.CLOSE)
        self.close = f'{close}=""'
        open = self.config(env, 'openTrigger', MicroModal.OPEN)
        self.open = f'{open}=""'

    def attributes(self):
        attributes = ['aria-hidden="true"']
        if self.color:
            attributes.append(f'data-md-color-accent="{self.color}"')
            attributes.append(f'data-md-color-primary="{self.color}"')
        return ' '.join(attributes)

    @classmethod
    def config(self, env, key, default):
        # NOTE: page values are not available here.
        try:
            return env.conf['extra']['micromodal'][key]
        except Exception as e:
            return default

    def markdown(self, allow):
        # https://michelf.ca/projects/php-markdown/extra/
        return 'markdown="1"' if allow else 'markdown="0"'

    def render(self) -> str:
        md1 = self.markdown(True)
        return (
            f'<div class="modal" id="{self.id}" {self.attributes()} {md1}>\n'
            f'<div class="modal-backdrop" tabindex="-1" {self.close} {md1}>\n'
            f'<div class="{self.dialog_class}" aria-modal="true" '
            f'aria-labelledby="{self.id}-title" role="dialog" {md1}>\n'
            f'<div class="modal-content" {md1}>\n'
            f'{self.renderHeader()}\n'
            f'{self.renderBody()}\n'
            f'<hr>\n'
            f'{self.renderFooter()}\n'
            f'</div></div></div></div>\n'
        )

    def renderBody(self):
        return (
            f'<div class="modal-body" {self.markdown(True)}>\n'
            f'{self.body}\n'
            f'</div>\n'
        )

    def renderFooter(self):
        buttons = [button.render() for button in self.buttons if button]
        return (
            f'<div class="modal-footer" {self.markdown(True)}>\n'
            f'{" ".join(buttons)}\n'
            "{: .modal-footer-buttons }"
            f'</div>\n'
        )

    def renderHeader(self):
        return (
            f'<div class="modal-header">\n'
            f'<span id="{self.id}-title" '
            f'class="md-ellipsis modal-title">'
            f'{self.title}'
            f'</span>\n'
            f'<button class="modal-close" aria-label="Close" {self.close}>'
            f'<span aria-hidden="true">&times;</span>'
            f'</button>\n'
            f'</div>\n'
        )

    def scrollable(self, scrollable):
        return 'modal-dialog-scrollable' if scrollable else ''

    def __safe_id(self, id):
        return f"modal-{re.sub('[^0-9a-zA-Z]+', '-', id).lower()}"
