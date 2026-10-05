# LMS Project — Maintenance Guide

## Build
mvn clean install

## Test
mvn test

## Run
java -cp target/classes com.hitms.lms.Main

## Notes for contributors

- All checked exceptions must extend Exception and carry a clear message.
- New LibraryItem subtypes must be registered in LibraryItemFactory.
- Run "mvn checkstyle:check" before opening a pull request.
