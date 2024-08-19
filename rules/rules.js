import { kind, Lang, pattern } from "@ast-grep/napi";

export const tableCellRule = {
    rule: {
        all: [
            {
                inside: {
                    any: [
                        {
                            pattern: '<TableBody> $_BODY </TableBody>'
                        },
                        {
                            pattern: '<TableHead> $_BODY </TableHead>'
                        }],
                    stopBy: 'end',
                }
            },
            {
                pattern: '<TableRow $$$ARGS> $$$CELLS </TableRow>'
            },
        ]
    },
    language: Lang.Tsx
};

export const tdRule = {
    rule: {
        all: [
            {
                inside: {
                    pattern: '<tbody> $_BODY </tbody>',
                    stopBy: 'end',
                }
            },
            {
                pattern: '<tr $$$ARGS> $$$CELLS </tr>'
            },
        ]
    },
    language: Lang.Tsx
};

export const formRule = {
    rule: {
        all: [
            {
                any: [
                    {
                        has: {
                            pattern: '<TextField $$$_ARGS/>',
                            stopBy: 'neighbor',
                        }
                    },
                    {
                        has: {
                            pattern: '<input $$$_ARGS/>',
                            stopBy: 'neighbor',
                        }
                    }]
            },
            {
                pattern: '<$OPEN_TAG $$$ARGS> $$$BODY </$OPEN_TAG>'
            },
        ]
    },
    language: Lang.Tsx
};

export const tableGridRule = (identifier) => {
    return {
        rule: {
            all: [
                {
                    inside: {
                        all: [
                            { pattern: `const ${identifier} = $_` },
                            { kind: 'lexical_declaration' }
                        ],
                        stopBy: 'end',
                    }
                },
                {
                    inside: {
                        kind: 'arguments',
                        stopBy: 'end',
                    }
                },
                {
                    nthChild: 1
                },
                {
                    any: [
                        {
                            kind: 'arrow_function'
                        },
                        {
                            kind: 'array'
                        }
                    ]
                }
            ]
        },
        language: Lang.Tsx
    }
};

export const tableGridIdentifierRule = {
    rule: {
        any: [
            { pattern: '<DataGrid $$$_ columns={$ID} $$$_/>' },
            { pattern: '<DataGrid $$$_ columns={$ID} $$$_> $$$_ </DataGrid>' }
        ]
    }
}