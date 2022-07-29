#!/usr/bin/env python3

from button import Button
from micromodal import MicroModal


class Patcher:
    def __init__(self, env: dict, id: str = 'patcher'):
        self.env = env
        self.id = id
        self.app_class = f"{self.id}-app"
        self.info_class = 'rom-info'
        self.meta_class = 'rom-info-meta'

    def body(self):
        accepted = '.n64,.v64,.z64,.zip'
        return (
            f'<div class="{self.app_class}" markdown="1">\n'
            '|   |   |\n'
            '|---|---|\n'
            '|ROM File|'
            '<label class="md-filepicker" for="input-file-rom">'
            f'<input id="input-file-rom" type="file" accept="{accepted}">'
            '</label>'
            '<span id="zip-dropdown"><br>'
            '<select class="md-dropdown" id="zip-dropdown-select"></select>'
            '</span>'
            '|\n'
            '|   |   |\n'
            f"{self.romInfo('format', 'ROM Format')}"
            f"{self.romInfo('crcs', 'ROM CRCs')}"
            '|   |   |\n'
            f"{self.romInfo('crc32', 'CRC32')}"
            f"{self.romInfo('md5', 'MD5')}"
            f"{self.romInfo('sha1', 'SHA1')}"
            '|   |   |\n'
            '|Patch File|'
            '<select class="md-dropdown" id="input-file-patch"></select>'
            '|\n'
            '</div>\n'
        )

    def cancelButton(self):
        trigger = MicroModal.config(self.env, 'closeTrigger', MicroModal.CLOSE)
        return Button(
            self.env,
            text='Cancel',
            href='#',
            primary=False,
            attributes=[
                trigger,
                '#button-cancel',
            ]
        )

    def modal(self, body: str = ''):
        return MicroModal(
            self.env,
            id=self.id,
            title='Patch ROM',
            confirm=self.patchButton(),
            dismiss=self.cancelButton(),
            buttons=[self.statusMessage()],
            size='md',
            scrollable=False,
            body=body,
        )

    def patchButton(self):
        spin = ':fontawesome-solid-spinner:{ .fa-spin style="display: none;" }'
        return Button(
            self.env,
            text=f'Apply {spin}',
            href='#',
            primary=True,
            attributes=['#button-apply']
        )

    def romInfo(self, id: str, name: str):
        return (
            f'|{name}|'
            f'<span class="{self.info_class}" data-clipboard-target="#{id}">'
            f'<span id="{id}" title="Copy to Clipboard"></span>'
            f'<span id="message-{id}"></span>'
            f'</span>|\n'
        )

    # yes, this is actually passed as a Button
    def statusMessage(self):
        return Button(
            self.env,
            text='<span id="message-status"></span>',
            secondary=True,
            attributes=[
                '.message',
                '#button-status',
            ]
        )

    def render(self) -> str:
        return self.modal(self.body()).render()
