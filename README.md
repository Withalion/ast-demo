# Ast-grep demo project

This is only a small CLI program to support adding fields to tables and forms.

# How to run it?

`node index.js`

`add-field file_path field_name data_type`

- `file_path` - can be absolute or relative
- `field_name` - supports case-insensitive values `tablecell`, `td`, `column`(for DataGrid), `input`, `textfield`
- `data_type` - supports first character case-insensitive values `string`, `integer`, `decimal`, `date`

# Testing files

multiple test files can be found in _test_files_ folder

| File name                                                                                                                                            | Test case              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| [App.tsx](https://github.com/refinedev/refine/blob/master/examples/form-material-ui-use-form/src/App.tsx)                                            | No form or table found |
| [basic.stories.tsx](https://github.com/refinedev/refine/blob/next/examples/with-storybook-material-ui/src/stories/dataGrid/basic.stories.tsx)        | DataGrid               |
| [edit.tsx](https://github.com/refinedev/refine/blob/master/examples/form-material-ui-use-form/src/pages/posts/edit.tsx)                              | Form                   |
| [editForm.stories.tsx](https://github.com/refinedev/refine/blob/next/examples/with-storybook-material-ui/src/stories/modalForm/editForm.stories.tsx) | Form                   |
| [index.tsx](https://github.com/refinedev/refine/blob/master/examples/table-material-ui-advanced/src/pages/table/index.tsx)                           | MUI table              |
| [list.tsx](https://github.com/refinedev/refine/blob/master/examples/table-react-table-basic/src/pages/posts/list.tsx)                                | HTML table             |
