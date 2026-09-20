#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    int key;

    cout << "Enter a sentence: ";
    getline(cin, text);

    cout << "Enter key: ";
    cin >> key;

    for (char &ch : text) {
        if (ch >= 'A' && ch <= 'Z') {
            ch = (ch - 'A' + key) % 26 + 'A';
        }
        else if (ch >= 'a' && ch <= 'z') {
            ch = (ch - 'a' + key) % 26 + 'a';
        }
    }

    cout << "Encrypted text: " << text << endl;

    return 0;
}