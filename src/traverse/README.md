# Traversers

Traversers are an approach of traversing a syntax tree. The functions provided
by this namespace can be used to scan a lezer tree.

## Example

```java
@TestAnnotation
public class Test {
  //
}
```

```ts
// Traverses all modifiers of a class in a `.java` file.

traverser.traverseDeclarations<void>({
  class: traverser.traverseClass(
    modifiers: traverser.traverseModifiers({
      modifier: mod => console.log("Modifier: " + mod),
      annotation: traverser.traverseAnnotation({
        name: ({from, to}) => {
          console.log("Annotation: " + code.substring(from, to));
        },
      }),
    }),
  ),
})(code);
```
