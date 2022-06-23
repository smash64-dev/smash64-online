#!/usr/bin/env python3


class Button:
    def __init__(self, env: dict, text: str = '',
                 href: str = 'javascript:;', color: str = 'default',
                 primary: bool = None, secondary: bool = None,
                 is_ref: bool = False, attributes: list = []):
        self.env = env
        self.text = text
        self.href = href
        self.color = color
        self.primary = primary
        self.secondary = False if primary is not None else secondary
        self.is_ref = is_ref
        self.attributes = attributes
        self.can_attr_list()

    def attr_list(self):
        color = self.color
        attributes = self.attributes + [
            '.md-button',
            '.md-button--primary' if self.primary else '',
            '.md-button--secondary' if self.secondary else '',
            f'data-md-color-primary="{color}"' if color else '',
            f'data-md-color-accent="{color}"' if color else '',
        ]

        # https://python-markdown.github.io/extensions/attr_list/
        attributes = set([attr for attr in attributes if attr])
        return ' '.join(list(attributes))

    def can_attr_list(self):
        # https://squidfunk.github.io/mkdocs-material/setup/extensions/python-markdown/?h=attr#attribute-lists=
        exts = 'markdown_extensions'
        attr_list = 'attr_list'

        if exts in self.env.conf and attr_list in self.env.conf[exts]:
            return True
        else:
            raise KeyError(f"{exts} must contain {attr_list} to use button.")

    def render(self) -> str:
        href = f"[{self.href}]" if self.is_ref else f"({self.href})"
        return (
            f"[{self.text}]{href}"
            f"{{ {self.attr_list()} }}"
        )
