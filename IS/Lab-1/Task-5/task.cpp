#include <iostream>
#include <string>
using namespace std;

string encrypt(string text, int key) {
    for (char &ch : text) {
        if (ch >= 'A' && ch <= 'Z') {
            ch = (ch - 'A' + key) % 26 + 'A';
        }
        else if (ch >= 'a' && ch <= 'z') {
            ch = (ch - 'a' + key) % 26 + 'a';
        }
    }

    return text;
}

int main() {
    string text = "Hello World";

    cout << "Key 3: " << encrypt(text, 3) << endl;
    cout << "Key 5: " << encrypt(text, 5) << endl;
    cout << "Key 10: " << encrypt(text, 10) << endl;

    return 0;
}