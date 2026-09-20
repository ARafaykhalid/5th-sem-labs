#include <iostream>
#include <string>
using namespace std;

string prepareText(string text) {
    string result = "";

    for (char c : text) {
        c = toupper(c);

        if (c == 'J')
            c = 'I';

        result += c;
    }

    string prepared = "";

    for (int i = 0; i < result.length(); i++) {
        prepared += result[i];

        if (i + 1 < result.length() &&
            result[i] == result[i + 1]) {
            prepared += 'X';
        }
    }

    if (prepared.length() % 2 != 0)
        prepared += 'X';

    return prepared;
}

int main() {
    string plaintext = "HITMS";

    string prepared = prepareText(plaintext);

    cout << "Plaintext: " << plaintext << endl;
    cout << "Prepared Text: " << prepared << endl;

    cout << "\nPrepared Pairs: ";

    for (int i = 0; i < prepared.length(); i += 2) {
        cout << prepared[i] << prepared[i + 1] << " ";
    }

    cout << endl;

    return 0;
}