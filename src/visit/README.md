# Visitors

Visitors are an approach of traversing a syntax tree. The functions provided
by this namespace can be used to scan a lezer tree.

## Example

```java
@TestAnnotation
public class Test {
  //
}
```

```ts
// Visits all modifiers of a class in a `.java` file.

const errors: string[] = [];
visitor.visitDeclarations<string>({
  class: visitor.visitClass(
    modifiers: visitor.visitModifiers({
      modifier: mod => console.log("Modifier: " + mod),
      annotation: visitor.visitAnnotation({
        name: ({from, to}) => {
          console.log("Annotation: " + code.substring(from, to));
        },
      }),
    }),
  ),
})(code, errors);
```
