#include <iostream>
#include <string>
using namespace std;

char matrix[5][5];

void generateMatrix(string key) {
    string used = "";

    for (char c : key) {
        c = toupper(c);
        if (c == 'J') c = 'I';

        if (used.find(c) == string::npos)
            used += c;
    }

    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J') continue;

        if (used.find(c) == string::npos)
            used += c;
    }

    int k = 0;

    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            matrix[i][j] = used[k++];
}

string prepareText(string text) {
    string result = "";

    for (char c : text) {
        c = toupper(c);
        if (c == 'J') c = 'I';
        result += c;
    }

    string prepared = "";

    for (int i = 0; i < result.length(); i++) {
        prepared += result[i];

        if (i + 1 < result.length() && result[i] == result[i + 1]) {
            prepared += 'X';
        }
    }

    if (prepared.length() % 2 != 0)
        prepared += 'X';

    return prepared;
}

int main() {
    string keyword = "MONARCHY";
    string plaintext = "BALLOON";

    generateMatrix(keyword);

    string prepared = prepareText(plaintext);

    cout << "Keyword: " << keyword << endl;
    cout << "Plaintext: " << plaintext << endl;

    cout << "Prepared Text: " << prepared << endl;

    cout << "\nPrepared Pairs: ";
    for (int i = 0; i < prepared.length(); i += 2) {
        cout << prepared[i] << prepared[i + 1] << " ";
    }

    cout << "\n\nFiller X inserted between repeated L's." << endl;

    return 0;
}