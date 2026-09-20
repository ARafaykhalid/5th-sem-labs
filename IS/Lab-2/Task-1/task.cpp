#include <iostream>
#include <string>
using namespace std;

char matrix[5][5];

void generateMatrix(string key) {
    string used = "";

    for (char c : key) {
        c = toupper(c);
        if (c == 'J') c = 'I';

        if (used.find(c) == string::npos && c >= 'A' && c <= 'Z') {
            used += c;
        }
    }

    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J') continue;

        if (used.find(c) == string::npos) {
            used += c;
        }
    }

    int k = 0;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            matrix[i][j] = used[k++];
        }
    }
}

void findPosition(char c, int &row, int &col) {
    if (c == 'J') c = 'I';

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            if (matrix[i][j] == c) {
                row = i;
                col = j;
                return;
            }
        }
    }
}

string prepareText(string text) {
    string result = "";

    for (char c : text) {
        c = toupper(c);
        if (c == 'J') c = 'I';

        if (c >= 'A' && c <= 'Z') {
            result += c;
        }
    }

    string prepared = "";

    for (int i = 0; i < result.length(); i++) {
        prepared += result[i];

        if (i + 1 < result.length() && result[i] == result[i + 1]) {
            prepared += 'X';
        }
    }

    if (prepared.length() % 2 != 0) {
        prepared += 'X';
    }

    return prepared;
}

string encrypt(string text) {
    string cipher = "";

    for (int i = 0; i < text.length(); i += 2) {
        int r1, c1, r2, c2;

        findPosition(text[i], r1, c1);
        findPosition(text[i + 1], r2, c2);

        if (r1 == r2) {
            cipher += matrix[r1][(c1 + 1) % 5];
            cipher += matrix[r2][(c2 + 1) % 5];
        }
        else if (c1 == c2) {
            cipher += matrix[(r1 + 1) % 5][c1];
            cipher += matrix[(r2 + 1) % 5][c2];
        }
        else {
            cipher += matrix[r1][c2];
            cipher += matrix[r2][c1];
        }
    }

    return cipher;
}

int main() {
    string keyword = "MONARCHY";
    string plaintext = "INSTRUMENTS";

    generateMatrix(keyword);

    cout << "Playfair Matrix:\n\n";

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    string prepared = prepareText(plaintext);
    string ciphertext = encrypt(prepared);

    cout << "\nKeyword: " << keyword;
    cout << "\nPlaintext: " << plaintext;
    cout << "\nPrepared Pairs: ";

    for (int i = 0; i < prepared.length(); i += 2) {
        cout << prepared[i] << prepared[i + 1] << " ";
    }

    cout << "\nCiphertext: " << ciphertext << endl;

    return 0;
}