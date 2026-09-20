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

    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            matrix[i][j] = used[k++];
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

        if (c >= 'A' && c <= 'Z')
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
    string result = "";

    for (int i = 0; i < text.length(); i += 2) {

        int r1, c1, r2, c2;

        findPosition(text[i], r1, c1);
        findPosition(text[i + 1], r2, c2);

        if (r1 == r2) {
            result += matrix[r1][(c1 + 1) % 5];
            result += matrix[r2][(c2 + 1) % 5];
        }
        else if (c1 == c2) {
            result += matrix[(r1 + 1) % 5][c1];
            result += matrix[(r2 + 1) % 5][c2];
        }
        else {
            result += matrix[r1][c2];
            result += matrix[r2][c1];
        }
    }

    return result;
}

string decrypt(string text) {
    string result = "";

    for (int i = 0; i < text.length(); i += 2) {

        int r1, c1, r2, c2;

        findPosition(text[i], r1, c1);
        findPosition(text[i + 1], r2, c2);

        if (r1 == r2) {
            result += matrix[r1][(c1 + 4) % 5];
            result += matrix[r2][(c2 + 4) % 5];
        }
        else if (c1 == c2) {
            result += matrix[(r1 + 4) % 5][c1];
            result += matrix[(r2 + 4) % 5][c2];
        }
        else {
            result += matrix[r1][c2];
            result += matrix[r2][c1];
        }
    }

    return result;
}

int main() {

    string keyword = "MONARCHY";
    string plaintext = "INSTRUMENTS";

    generateMatrix(keyword);

    string prepared = prepareText(plaintext);
    string ciphertext = encrypt(prepared);
    string decrypted = decrypt(ciphertext);

    cout << "Plaintext: " << plaintext << endl;
    cout << "Prepared Text: " << prepared << endl;
    cout << "Ciphertext: " << ciphertext << endl;
    cout << "Decrypted Text: " << decrypted << endl;

    cout << "\nAdded X characters in prepared text: ";

    for (int i = 0; i < prepared.length(); i++) {
        if (prepared[i] == 'X') {
            cout << "X at position " << i + 1 << " ";
        }
    }

    cout << endl;

    return 0;
}