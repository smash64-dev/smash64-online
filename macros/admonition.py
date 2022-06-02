#!/usr/bin/env python3

from enum import Enum
import re


class Admonition:
    """https://squidfunk.github.io/mkdocs-material/reference/admonitions/"""
    class Inline(Enum):
        Null = ""
        Start = " inline"
        End = " inline end"

    def __init__(self, env: dict, message: str, style: str = "note",
                 title: str = None, collapsible: bool = False,
                 collapsed: bool = False, inline: Inline = Inline.Null):
        self.env = env
        self.message = message
        self.style = style.lower()
        self.title = f"\"{title}\"" if title is not None else title
        self.collapsible = collapsible
        self.collapsed = collapsed
        self.inline = inline
        self.can_collapse()

    def can_collapse(self):
        # https://squidfunk.github.io/mkdocs-material/reference/admonitions/#collapsible-blocks
        exts = 'markdown_extensions'
        details = 'pymdownx.details'

        if exts in self.env.conf and details in self.env.conf[exts]:
            return True

        if self.collapsible or self.collapsed:
            raise KeyError(f"{exts} must contain {details} to use collapse.")
        else:
            return False

    def render(self) -> str:
        bang = '???' if self.collapsible else '!!!'
        state = '+' if self.collapsible and not self.collapsed else ''
        style = f"{self.style}{self.inline.value}"
        head = style if not self.title else f"{style} {self.title}"

        # format the message
        message = re.sub('\n(?!\t)(.)', '\n\t\\1', self.message)
        message = re.sub('\t', '    ', message)
        message = re.sub('\n', '<br>', message)
        return f"{bang}{state} {head}\n    {message}"
