// woff2 wasm binding

#include <string>
#include <vector>
#include <woff2/decode.h>
#include <woff2/encode.h>
#include <emscripten.h>
#include <emscripten/bind.h>
using namespace emscripten;

using std::string;

std::vector<unsigned char> woff2_dec(string woff2buf, size_t bufSize)
{
    const uint8_t *raw_input = reinterpret_cast<const uint8_t *>(woff2buf.data());
    string output(
        std::min(woff2::ComputeWOFF2FinalSize(raw_input, woff2buf.size()),woff2::kDefaultMaxSize),
        0);
    woff2::WOFF2StringOut out(&output);
    const bool ok = woff2::ConvertWOFF2ToTTF(raw_input, woff2buf.size(), &out);
    if (!ok)
    {
        const std::vector<uint8_t> empty;
        return empty;
    }
    const std::vector<uint8_t> uint8Arr(output.begin(), output.begin() + out.Size());
    return uint8Arr;
}

std::vector<unsigned char> woff2_enc(string ttfbuf, size_t bufSize)
{
    const uint8_t *raw_input = reinterpret_cast<const uint8_t *>(ttfbuf.data());
    size_t outputLength = ttfbuf.size();
    uint8_t *output = new uint8_t[outputLength]{0};
    const bool ok = woff2::ConvertTTFToWOFF2(raw_input, ttfbuf.size(), output, &outputLength);
    if (!ok)
    {
        const std::vector<uint8_t> empty;
        return empty;
    }
    const std::vector<uint8_t> uint8Arr(output, output + outputLength);
    return uint8Arr;
}

EMSCRIPTEN_BINDINGS(woff2)
{
    register_vector<uint8_t>("vector<uint8_t>");
    function("woff2Dec", &woff2_dec);
    function("woff2Enc", &woff2_enc);
}
