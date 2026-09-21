#include <iostream>
using namespace std;

long long gcd(long long a, long long b)
{
  while (b != 0)
  {
    long long t = b;
    b = a % b;
    a = t;
  }
  return a;
}

long long modMul(long long a, long long b, long long mod)
{
  return (long long)((__int128)a * b % mod);
}

long long modPow(long long base, long long exp, long long mod)
{
  long long result = 1;
  base %= mod;
  while (exp > 0)
  {
    if (exp % 2 == 1)
    {
      result = modMul(result, base, mod);
    }
    base = modMul(base, base, mod);
    exp = exp / 2;
  }
  return result;
}

long long modInverse(long long e, long long phi)
{
  long long t = 0, newT = 1;
  long long r = phi, newR = e;
  while (newR != 0)
  {
    long long q = r / newR;
    long long tmpT = t;
    t = newT;
    newT = tmpT - q * newT;
    long long tmpR = r;
    r = newR;
    newR = tmpR - q * newR;
  }
  if (r > 1)
    return -1;
  if (t < 0)
    t += phi;
  return t;
}

bool isPrime(long long n)
{
  if (n < 2)
    return false;
  for (long long i = 2; i * i <= n; i++)
  {
    if (n % i == 0)
      return false;
  }
  return true;
}

int main()
{
  long long p, q, e, m;
  cout << "Enter prime p: ";
  cin >> p;
  cout << "Enter prime q: ";
  cin >> q;

  if (!isPrime(p) || !isPrime(q) || p == q)
  {
    cout << "p and q must be different primes.\n";
    return 1;
  }

  long long n = p * q;
  long long phi = (p - 1) * (q - 1);

  cout << "Enter public exponent e: ";
  cin >> e;
  if (e <= 1 || e >= phi || gcd(e, phi) != 1)
  {
    cout << "Bad e.\n";
    return 1;
  }

  long long d = modInverse(e, phi);
  cout << "Enter message m (0 to n-1): ";
  cin >> m;
  if (m < 0 || m >= n)
  {
    cout << "Bad m.\n";
    return 1;
  }

  long long c = modPow(m, e, n);
  long long back = modPow(c, d, n);

  cout << "\nn=" << n << " phi=" << phi
       << " e=" << e << " d=" << d
       << " m=" << m << " c=" << c
       << " decrypted=" << back << endl;

  return 0;
}