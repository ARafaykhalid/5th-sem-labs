#include <iostream>
#include <string>
using namespace std;

int main() {
    string paragraph;
    int key;

    cout << "Enter your paragraph:\n";
    getline(cin, paragraph);

    cout << "Enter key: ";
    cin >> key;

    for (char &ch : paragraph) {
        if (ch >= 'A' && ch <= 'Z') {
            ch = (ch - 'A' + key) % 26 + 'A';
        }
        else if (ch >= 'a' && ch <= 'z') {
            ch = (ch - 'a' + key) % 26 + 'a';
        }
    }

    cout << "\nEncrypted paragraph:\n";
    cout << paragraph << endl;

    return 0;
}