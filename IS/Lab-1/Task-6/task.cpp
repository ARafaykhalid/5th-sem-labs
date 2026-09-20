#include <iostream>
#include <string>
using namespace std;

string decrypt(string text, int key) {
    for (char &ch : text) {
        if (ch >= 'A' && ch <= 'Z') {
            ch = (ch - 'A' - key + 26) % 26 + 'A';
        }
        else if (ch >= 'a' && ch <= 'z') {
            ch = (ch - 'a' - key + 26) % 26 + 'a';
        }
    }

    return text;
}

int main() {
    string cipher;

    cout << "Enter ciphertext: ";
    getline(cin, cipher);

    cout << "\nBrute Force Results:\n";

    for (int key = 1; key <= 25; key++) {
        cout << "Key " << key << ": "
             << decrypt(cipher, key) << endl;
    }

    return 0;
}