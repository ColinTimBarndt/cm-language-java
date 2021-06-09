package tests;

import java.lang.String;

@Deprecated(since = "9")
public class Simple {
	private static final String HELLO = "Hello, world!";

	public static void main(String[] args) {
		System.out.println(HELLO);
		label: for (int i = 0; i < 5; i++) {
			if (i == 2)
				break label;
		}
	}
}