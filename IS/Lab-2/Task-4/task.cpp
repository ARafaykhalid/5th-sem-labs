#include <iostream>
#include <string>
using namespace std;

char matrix[5][5];

void generateMatrix(string key) {
    string used = "";

    for (char c : key) {
        c = toupper(c);

        if (c == 'J')
            c = 'I';

        if (c >= 'A' && c <= 'Z' &&
            used.find(c) == string::npos) {
            used += c;
        }
    }

    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J')
            continue;

        if (used.find(c) == string::npos)
            used += c;
    }

    int k = 0;

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            matrix[i][j] = used[k++];
        }
    }
}

void findPosition(char c, int &row, int &col) {
    if (c == 'J')
        c = 'I';

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
    string clean = "";

    for (char c : text) {
        c = toupper(c);

        if (c == 'J')
            c = 'I';

        clean += c;
    }

    string prepared = "";

    for (int i = 0; i < clean.length(); i++) {
        prepared += clean[i];

        if (i + 1 < clean.length() &&
            clean[i] == clean[i + 1]) {
            prepared += 'X';
        }
    }

    if (prepared.length() % 2 != 0)
        prepared += 'X';

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

string playfair(string keyword, string plaintext) {
    generateMatrix(keyword);

    string prepared = prepareText(plaintext);

    return encrypt(prepared);
}

int main() {

    string plaintext = "INSTRUMENTS";

    string keyword1 = "MONARCHY";
    string keyword2 = "COMPUTER";

    string ciphertext1 = playfair(keyword1, plaintext);
    string ciphertext2 = playfair(keyword2, plaintext);

    cout << "Plaintext: " << plaintext << endl;

    cout << "\nKeyword 1: " << keyword1 << endl;
    cout << "Ciphertext 1: " << ciphertext1 << endl;

    cout << "\nKeyword 2: " << keyword2 << endl;
    cout << "Ciphertext 2: " << ciphertext2 << endl;

    cout << "\nConclusion: Changing the keyword changes the Playfair matrix";
    cout << " and therefore changes the ciphertext." << endl;

    return 0;
}