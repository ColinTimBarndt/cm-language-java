# cm-language-java

[![CodeMirror 6](https://img.shields.io/badge/CodeMirror-6-informational?logo=CodeMirror)](https://codemirror.net/6/)
![Under development](https://img.shields.io/badge/Status-under%20development-important)

This [CodeMirror 6] plugin adds support for the Java programming language,
including linting, autocomplete and syntax highlighting.

This plugin is based on the [`@codemirror/lang-java`] plugin.

[CodeMirror 6]: https://codemirror.net/6/
[`@codemirror/lang-java`]: https://github.com/codemirror/lang-java/

## Notice

This plugin is under development. Breaking changes will happen. Contributions
are welcome.

## Todo

### Traverse

* [ ] Program
  * [x] (for a one-class-per-file structure)
* [ ] PackageDeclaration
* [x] ImportDeclaration
  * [x] name
    * [x] Identifier
    * [x] ScopedIdentifier
* [x] ClassDeclaration
  * [x] ClassBody
* [x] InterfaceDeclaration
  * [x] InterfaceBody
* [ ] EnumDeclaration
  * [ ] EnumBody
  * [ ] EnumBodyDeclarations
  * [ ] EnumConstant
* [ ] AnnotationTypeDeclaration
  * [ ] AnnotationTypeBody
  * [ ] AnnotationTypeElementDeclaration
* [ ] ModuleDeclaration
  * [ ] ModuleBody
  * [ ] ModuleDirective
* [ ] ConstructorDeclaration
  * [ ] ConstructorBody
* [x] MethodDeclaration
* [x] FieldDeclaration / ConstantDeclaration
* [x] InterfaceTypeList
* [x] Modifiers
  * [x] annotation
  * [ ] AnnotationArgumentList
  * [ ] ElementValuePair
* [x] type
  * [x] simpleType
  * [x] unannotatedType
  * [ ] TypeName
  * [ ] TypeArguments
  * [ ] TypeBound
  * [ ] TypeParameters
    * [ ] TypeParameter
  * [ ] Wildcard
  * [x] ArrayType
    * [x] Dimension
* [ ] ArrayInitializer
* [x] Block
  * [ ] ExpressionStatement
  * [ ] LabeledStatement
  * [ ] IfStatement
  * [ ] WhileStatement
  * [ ] ForStatement
  * [ ] EnhancedForStatement
  * [ ] AssertStatement
  * [ ] SwitchStatement
    * [ ] SwitchBlock
    * [ ] SwitchLabel
  * [ ] DoStatement
  * [x] BreakStatement
  * [x] ContinueStatement
  * [x] ReturnStatement
  * [ ] SynchronizedStatement
  * [ ] LocalVariableDeclaration
    * [ ] VariableInitializer
  * [x] ThrowStatement
  * [ ] TryStatement
    * [ ] CatchClause
    * [ ] FinallyClause
  * [ ] TryWithResourcesStatement
* [ ] expression
  * [ ] AssignmentExpression
  * [ ] BinaryExpression
  * [ ] InstanceofExpression
  * [ ] LambdaExpression
  * [ ] TernaryExpression
  * [ ] UpdateExpression
  * [ ] baseExpression
  * [ ] UnaryExpression
  * [ ] CastExpression
  * [ ] baseExpression
    * [ ] literal
    * [ ] ClassLiteral
    * [ ] "this"
    * [ ] Identifier
    * [ ] ParenthesizedExpression
    * [ ] ObjectCreationExpression
    * [ ] FieldAccess
    * [ ] ArrayAccess
    * [ ] MethodInvocation
    * [ ] MethodReference
    * [ ] ArrayCreationExpression
* [ ] literal
  * [ ] IntegerLiteral
  * [ ] FloatingPointLiteral
  * [ ] BooleanLiteral
  * [ ] CharacterLiteral
  * [ ] StringLiteral
  * [ ] "null"
