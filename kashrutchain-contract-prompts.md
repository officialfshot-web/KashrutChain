# KashrutChain — Smart Contract Spec & OpenAI Prompt Templates

**Project:** KashrutChain — AI + Blockchain Kosher Verification  
**Date:** May 25, 2026  
**Author:** Kevin Armendraiz  

---

## Part 1: Smart Contract Specification

### Overview
A lightweight, permissioned registry on **Polygon PoS** (low gas fees, fast finality, Ethereum-compatible). The contract stores kosher certification records as immutable entries. Only approved certifier addresses can write. Anyone can read and verify.

### Why Polygon PoS
| Factor | Reason |
|---|---|
| **Gas Cost** | ~$0.001 per write vs. $5-20 on Ethereum mainnet |
| **Speed** | 2-second block time; ~2.3s finality |
| **Ecosystem** | Full EVM compatibility; Web3j supports it natively |
| **Testnet** | Mumbai testnet for free development and demo |

### Contract: KashrutRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KashrutRegistry
 * @notice Immutable registry for kosher certification records.
 *         Only whitelisted certifier addresses can register products.
 *         Anyone can query the registry for verification.
 */
contract KashrutRegistry {

    // ============ Structs ============

    struct CertificationRecord {
        address certifier;      // Address of the certifying agency
        bytes32 productHash;    // keccak256(productName + barcode + formulaFingerprint)
        bytes32 symbolHash;     // keccak256(certifierSymbolImage + symbolId)
        uint256 registeredAt;   // Block timestamp of registration
        bool isActive;          // Can be revoked (soft delete)
        string metadataURI;     // IPFS or HTTPS link to full product documentation
    }

    struct Certifier {
        string name;            // e.g. "Orthodox Union"
        string symbolCode;      // e.g. "OU", "OK", "STAR-K"
        bool isActive;          // Admin can disable rogue certifiers
        uint256 registrationDate;
    }

    // ============ State Variables ============

    address public owner;                          // Contract deployer / governance multisig
    uint256 public totalRecords;                   // Counter for records
    uint256 public totalCertifiers;                // Counter for certifiers

    mapping(bytes32 => CertificationRecord) public records;      // productHash => Record
    mapping(address => Certifier) public certifiers;             // certifierAddress => Certifier
    mapping(bytes32 => bool) public revokedSymbols;            // symbolHash => isRevoked

    // ============ Events ============

    event CertifierRegistered(
        address indexed certifierAddress,
        string name,
        string symbolCode,
        uint256 timestamp
    );

    event CertifierRevoked(
        address indexed certifierAddress,
        uint256 timestamp
    );

    event ProductCertified(
        address indexed certifier,
        bytes32 indexed productHash,
        bytes32 indexed symbolHash,
        uint256 timestamp,
        string metadataURI
    );

    event CertificationRevoked(
        bytes32 indexed productHash,
        address indexed certifier,
        uint256 timestamp,
        string reason
    );

    event VerificationQueried(
        bytes32 indexed productHash,
        bool isValid,
        uint256 timestamp
    );

    // ============ Modifiers ============

    modifier onlyOwner() {
        require(msg.sender == owner, "KashrutRegistry: caller is not the owner");
        _;
    }

    modifier onlyCertifier() {
        require(certifiers[msg.sender].isActive, "KashrutRegistry: caller is not an active certifier");
        _;
    }

    modifier validProductHash(bytes32 _productHash) {
        require(_productHash != bytes32(0), "KashrutRegistry: invalid product hash");
        _;
    }

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
    }

    // ============ Owner Functions ============

    /**
     * @notice Add a new certifying agency to the whitelist.
     * @param _certifierAddress The agency's Ethereum/Polygon address
     * @param _name Agency full name
     * @param _symbolCode Short code (e.g., "OU", "OK")
     */
    function registerCertifier(
        address _certifierAddress,
        string calldata _name,
        string calldata _symbolCode
    ) external onlyOwner {
        require(_certifierAddress != address(0), "Invalid address");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_symbolCode).length > 0, "Symbol code required");
        require(!certifiers[_certifierAddress].isActive, "Already registered");

        certifiers[_certifierAddress] = Certifier({
            name: _name,
            symbolCode: _symbolCode,
            isActive: true,
            registrationDate: block.timestamp
        });

        totalCertifiers++;

        emit CertifierRegistered(_certifierAddress, _name, _symbolCode, block.timestamp);
    }

    /**
     * @notice Revoke a certifier's ability to register new products.
     *         Existing records remain for audit trail.
     */
    function revokeCertifier(address _certifierAddress) external onlyOwner {
        require(certifiers[_certifierAddress].isActive, "Not active");
        certifiers[_certifierAddress].isActive = false;
        emit CertifierRevoked(_certifierAddress, block.timestamp);
    }

    /**
     * @notice Transfer contract ownership (e.g., to a multisig or DAO).
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }

    // ============ Certifier Functions ============

    /**
     * @notice Register a new kosher-certified product.
     * @param _productHash keccak256 hash of canonical product data
     * @param _symbolHash keccak256 hash of the certification symbol + ID
     * @param _metadataURI Link to full documentation (IPFS preferred)
     */
    function certifyProduct(
        bytes32 _productHash,
        bytes32 _symbolHash,
        string calldata _metadataURI
    ) external onlyCertifier validProductHash(_productHash) {
        require(_symbolHash != bytes32(0), "Invalid symbol hash");
        require(!revokedSymbols[_symbolHash], "Symbol has been revoked globally");
        require(records[_productHash].registeredAt == 0, "Product already certified");

        records[_productHash] = CertificationRecord({
            certifier: msg.sender,
            productHash: _productHash,
            symbolHash: _symbolHash,
            registeredAt: block.timestamp,
            isActive: true,
            metadataURI: _metadataURI
        });

        totalRecords++;

        emit ProductCertified(msg.sender, _productHash, _symbolHash, block.timestamp, _metadataURI);
    }

    /**
     * @notice Revoke a product certification (e.g., formula change, recall, fraud discovered).
     */
    function revokeProductCertification(
        bytes32 _productHash,
        string calldata _reason
    ) external onlyCertifier {
        CertificationRecord storage record = records[_productHash];
        require(record.registeredAt != 0, "Product not found");
        require(record.certifier == msg.sender, "Only registering certifier can revoke");
        require(record.isActive, "Already revoked");

        record.isActive = false;

        emit CertificationRevoked(_productHash, msg.sender, block.timestamp, _reason);
    }

    /**
     * @notice Globally revoke a symbol hash (e.g., counterfeit symbol detected).
     *         Only callable by owner (higher authority than individual certifier).
     */
    function revokeSymbolGlobally(bytes32 _symbolHash) external onlyOwner {
        revokedSymbols[_symbolHash] = true;
    }

    // ============ Public Read Functions ============

    /**
     * @notice Verify if a product hash exists and is active.
     * @return isValid true if product is certified and not revoked
     * @return certifierAddress the agency that registered it
     * @return registeredAt block timestamp of registration
     * @return symbolCode short code of the certifier
     * @return metadataURI link to full documentation
     */
    function verifyProduct(bytes32 _productHash)
        external
        view
        returns (
            bool isValid,
            address certifierAddress,
            uint256 registeredAt,
            string memory symbolCode,
            string memory metadataURI
        )
    {
        CertificationRecord memory record = records[_productHash];
        Certifier memory certifier = certifiers[record.certifier];

        bool valid = record.isActive
            && certifier.isActive
            && !revokedSymbols[record.symbolHash]
            && record.registeredAt != 0;

        emit VerificationQueried(_productHash, valid, block.timestamp);

        return (valid, record.certifier, record.registeredAt, certifier.symbolCode, record.metadataURI);
    }

    /**
     * @notice Batch verify multiple products (gas-efficient for grocery store receiving docks).
     */
    function verifyProductsBatch(bytes32[] calldata _productHashes)
        external
        view
        returns (bool[] memory results)
    {
        results = new bool[](_productHashes.length);
        for (uint256 i = 0; i < _productHashes.length; i++) {
            CertificationRecord memory record = records[_productHashes[i]];
            Certifier memory certifier = certifiers[record.certifier];
            results[i] = record.isActive
                && certifier.isActive
                && !revokedSymbols[record.symbolHash]
                && record.registeredAt != 0;
        }
        return results;
    }

    /**
     * @notice Check if a certifier address is whitelisted and active.
     */
    function isCertifierActive(address _certifierAddress) external view returns (bool) {
        return certifiers[_certifierAddress].isActive;
    }

    /**
     * @notice Get full certifier details.
     */
    function getCertifier(address _certifierAddress)
        external
        view
        returns (Certifier memory)
    {
        return certifiers[_certifierAddress];
    }

    /**
     * @notice Get full record for a product hash.
     */
    function getRecord(bytes32 _productHash)
        external
        view
        returns (CertificationRecord memory)
    {
        return records[_productHash];
    }
}
```

### Deployment & ABI Generation

```bash
# 1. Install Foundry (fastest Solidity toolchain)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. Initialize project
forge init kashrut-registry

# 3. Compile
forge build

# 4. Deploy to Polygon Mumbai (testnet)
forge create --rpc-url $MUMBAI_RPC \
  --private-key $DEPLOYER_KEY \
  --etherscan-api-key $POLYGONSCAN_KEY \
  --verify \
  src/KashrutRegistry.sol:KashrutRegistry

# 5. Extract ABI for Web3j
jq '.abi' out/KashrutRegistry.sol/KashrutRegistry.json > KashrutRegistry.abi
```

### Web3j Java Wrapper (Generated)

After running `web3j generate` on the ABI, you get `KashrutRegistry.java`:

```java
package com.kashrutchain.blockchain.contract;

import org.web3j.abi.datatypes.*;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

public class KashrutRegistry extends Contract {
    // Auto-generated by web3j wrapper generator
    // Key methods exposed for Kotlin usage:

    public static RemoteFunctionCall<TransactionReceipt> registerCertifier(
        Address _certifierAddress, Utf8String _name, Utf8String _symbolCode
    );

    public static RemoteFunctionCall<TransactionReceipt> certifyProduct(
        Bytes32 _productHash, Bytes32 _symbolHash, Utf8String _metadataURI
    );

    public static RemoteFunctionCall<Tuple5<Boolean, Address, Uint256, Utf8String, Utf8String>>
        verifyProduct(Bytes32 _productHash);

    public static RemoteFunctionCall<DynamicArray<Bool>> verifyProductsBatch(
        DynamicArray<Bytes32> _productHashes
    );
}
```

### Hash Generation (Android Side)

```kotlin
package com.kashrutchain.blockchain.util

import org.web3j.crypto.Hash
import java.nio.charset.StandardCharsets

object HashUtil {

    /**
     * Generates keccak256 hash from canonical product data.
     * Same algorithm used in contract to ensure consistency.
     */
    fun generateProductHash(
        productName: String,
        barcode: String,
        formulaFingerprint: String
    ): String {
        val canonical = "$productName|$barcode|$formulaFingerprint"
            .lowercase()
            .trim()
        return Hash.sha3String(canonical)
    }

    /**
     * Generates hash for kosher symbol image + certifier ID.
     */
    fun generateSymbolHash(symbolCode: String, certifierId: String): String {
        val canonical = "$symbolCode|$certifierId"
            .uppercase()
            .trim()
        return Hash.sha3String(canonical)
    }
}
```

---

## Part 2: OpenAI Prompt Templates

### Prompt Architecture
We use **GPT-4o** with JSON mode (guaranteed structured output). Each prompt has:
1. **System prompt** — defines role and output format
2. **User prompt** — contains the OCR text + specific task
3. **JSON schema** — enforces response structure

### System Prompt: Kashrut AI Parser

```
You are KashrutAI, a specialized food label analysis engine. Your job is to parse OCR-extracted text from product labels and extract structured kosher certification data.

RULES:
- Output ONLY valid JSON matching the provided schema.
- Do not add commentary, markdown, or explanations outside the JSON.
- If a field is missing or uncertain, use null (not empty string).
- Ingredient analysis must flag known non-kosher or ambiguous ingredients.
- Symbol recognition must map to standard certifier codes: OU, OK, STAR-K, KOF-K, CRC, CHK, BCK, VK, etc.
- Dairy/Meat/Pareve classification must be inferred from ingredients and symbol modifiers (e.g., OU-D = dairy, OU-Glatt = meat).
```

### User Prompt Template 1: Full Label Analysis

```json
{
  "task": "full_label_analysis",
  "ocr_text": "{{OCR_RAW_TEXT}}",
  "image_context": "product_label_photo",
  "output_schema": {
    "product_name": "string or null",
    "brand": "string or null",
    "barcode": "string or null (UPC/EAN extracted if visible)",
    "kosher_symbols": [
      {
        "symbol_code": "string (e.g., OU, OK, STAR-K)",
        "modifier": "string or null (e.g., D, Pareve, Glatt, M)",
        "detected_text": "string (exact text from label)",
        "confidence": "float 0.0-1.0",
        "position_hint": "string or null (e.g., 'front_bottom_right')"
      }
    ],
    "ingredients": [
      {
        "name": "string",
        "is_flagged": "boolean",
        "flag_reason": "string or null (e.g., 'animal_derived_enzyme', 'wine_vinegar', 'natural_flavors_unknown_source', 'gelatin', 'carmine', 'magnesium_stearate_ambiguous')",
        "kosher_status": "string: safe | caution | forbidden | unknown"
      }
    ],
    "classification": {
      "dietary": "string: dairy | meat | pareve | unknown",
      "passover_status": "string: kosher_for_passover | not_kosher_for_passover | chametz | unknown",
      "confidence": "float 0.0-1.0"
    },
    "manufacturer": "string or null",
    "country_of_origin": "string or null",
    "notes": "string or null (any unusual observations)"
  }
}
```

### Example Input

```
OCR_TEXT:
---
GOLDEN CRISPS
Cheddar Cheese Crackers
Net Wt 8 oz (227g)

INGREDIENTS: Enriched flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid), cheddar cheese (milk, cheese cultures, salt, enzymes), vegetable oil (canola, soybean, and/or sunflower oil), salt, natural flavors, maltodextrin, whey, yeast extract.

Contains: Wheat, Milk

Distributed by SnackCorp USA, Chicago, IL 60601

OU-D
---
```

### Expected GPT-4o Output

```json
{
  "product_name": "Cheddar Cheese Crackers",
  "brand": "Golden Crisps",
  "barcode": null,
  "kosher_symbols": [
    {
      "symbol_code": "OU",
      "modifier": "D",
      "detected_text": "OU-D",
      "confidence": 0.99,
      "position_hint": null
    }
  ],
  "ingredients": [
    {"name": "Enriched flour", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Cheddar cheese", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Vegetable oil", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Salt", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Natural flavors", "is_flagged": true, "flag_reason": "natural_flavors_unknown_source", "kosher_status": "caution"},
    {"name": "Maltodextrin", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Whey", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"},
    {"name": "Yeast extract", "is_flagged": false, "flag_reason": null, "kosher_status": "safe"}
  ],
  "classification": {
    "dietary": "dairy",
    "passover_status": "not_kosher_for_passover",
    "confidence": 0.94
  },
  "manufacturer": "SnackCorp USA",
  "country_of_origin": "USA",
  "notes": "Contains dairy ingredients (cheese, whey) consistent with OU-D classification. Natural flavors flagged for source verification. Product likely contains chametz (wheat flour) — not suitable for Passover."
}
```

---

### User Prompt Template 2: Quick Symbol Only

```json
{
  "task": "symbol_only",
  "ocr_text": "{{OCR_RAW_TEXT}}",
  "output_schema": {
    "kosher_symbols": [
      {
        "symbol_code": "string",
        "modifier": "string or null",
        "detected_text": "string",
        "confidence": "float 0.0-1.0"
      }
    ],
    "other_certifications": ["e.g., USDA Organic, Non-GMO"],
    "allergens": ["string"]
  }
}
```

### User Prompt Template 3: Ingredient Risk Analysis

```json
{
  "task": "ingredient_analysis",
  "ingredient_list": "{{COMMA_SEPARATED_INGREDIENTS}}",
  "known_dietary": "{{DAIRY | MEAT | PAREVE | UNKNOWN}}",
  "output_schema": {
    "risk_score": "float 0.0-1.0 (0 = definitely kosher, 1 = definitely not)",
    "flagged_ingredients": [
      {
        "name": "string",
        "risk_level": "low | medium | high | critical",
        "explanation": "string (why this ingredient is flagged)",
        "typical_sources": ["string (e.g., 'can be animal-derived', 'often wine-based')"],
        "recommendation": "string (what to check with certifier)"
      }
    ],
    "classification_override": "string or null (if ingredients contradict claimed classification)",
    "summary": "string (1-2 sentence verdict)"
  }
}
```

### Kotlin Implementation: OpenAI API Client

```kotlin
package com.kashrutchain.ai.parser

import com.kashrutchain.data.remote.api.OpenAiApi
import com.kashrutchain.data.remote.dto.OpenAiRequest
import com.kashrutchain.data.remote.dto.OpenAiResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class OpenAiParser @Inject constructor(
    private val api: OpenAiApi,
    private val promptTemplates: PromptTemplates
) {

    suspend fun parseFullLabel(ocrText: String): Result<ParsedLabel> = withContext(Dispatchers.IO) {
        try {
            val request = OpenAiRequest(
                model = "gpt-4o",
                messages = listOf(
                    OpenAiRequest.Message(
                        role = "system",
                        content = promptTemplates.systemPrompt
                    ),
                    OpenAiRequest.Message(
                        role = "user",
                        content = promptTemplates.buildFullLabelPrompt(ocrText)
                    )
                ),
                response_format = OpenAiRequest.ResponseFormat(
                    type = "json_object"
                ),
                temperature = 0.2,  // Low creativity, high consistency
                max_tokens = 2048
            )

            val response = api.analyzeLabel(request)
            val parsed = response.choices.first().message.content
                ?.let { Json.decodeFromString<ParsedLabel>(it) }
                ?: return@withContext Result.failure(IllegalStateException("Empty AI response"))

            Result.success(parsed)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun analyzeIngredients(
        ingredients: List<String>,
        knownDietary: String
    ): Result<IngredientAnalysis> = withContext(Dispatchers.IO) {
        try {
            val request = OpenAiRequest(
                model = "gpt-4o",
                messages = listOf(
                    OpenAiRequest.Message(
                        role = "user",
                        content = promptTemplates.buildIngredientPrompt(ingredients, knownDietary)
                    )
                ),
                response_format = OpenAiRequest.ResponseFormat(type = "json_object"),
                temperature = 0.2,
                max_tokens = 1024
            )

            val response = api.analyzeLabel(request)
            val parsed = response.choices.first().message.content
                ?.let { Json.decodeFromString<IngredientAnalysis>(it) }
                ?: return@withContext Result.failure(IllegalStateException("Empty AI response"))

            Result.success(parsed)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### Retrofit Interface

```kotlin
package com.kashrutchain.data.remote.api

import com.kashrutchain.data.remote.dto.OpenAiRequest
import com.kashrutchain.data.remote.dto.OpenAiResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface OpenAiApi {

    @POST("v1/chat/completions")
    suspend fun analyzeLabel(@Body request: OpenAiRequest): OpenAiResponse
}
```

### DTO Classes

```kotlin
package com.kashrutchain.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class OpenAiRequest(
    val model: String = "gpt-4o",
    val messages: List<Message>,
    @SerialName("response_format")
    val response_format: ResponseFormat,
    val temperature: Double = 0.2,
    @SerialName("max_tokens")
    val max_tokens: Int = 2048
) {
    @Serializable
    data class Message(
        val role: String,
        val content: String
    )

    @Serializable
    data class ResponseFormat(
        val type: String = "json_object"
    )
}

@Serializable
data class OpenAiResponse(
    val id: String,
    val choices: List<Choice>,
    val usage: Usage
) {
    @Serializable
    data class Choice(
        val message: Message,
        @SerialName("finish_reason")
        val finishReason: String
    ) {
        @Serializable
        data class Message(
            val role: String,
            val content: String?
        )
    }

    @Serializable
    data class Usage(
        @SerialName("prompt_tokens")
        val promptTokens: Int,
        @SerialName("completion_tokens")
        val completionTokens: Int,
        @SerialName("total_tokens")
        val totalTokens: Int
    )
}
```

### Prompt Templates Class

```kotlin
package com.kashrutchain.ai.parser

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PromptTemplates @Inject constructor() {

    val systemPrompt = """
        You are KashrutAI, a specialized food label analysis engine. Your job is to parse OCR-extracted text from product labels and extract structured kosher certification data.

        RULES:
        - Output ONLY valid JSON matching the provided schema.
        - Do not add commentary, markdown, or explanations outside the JSON.
        - If a field is missing or uncertain, use null (not empty string).
        - Ingredient analysis must flag known non-kosher or ambiguous ingredients.
        - Symbol recognition must map to standard certifier codes: OU, OK, STAR-K, KOF-K, CRC, CHK, BCK, VK, etc.
        - Dairy/Meat/Pareve classification must be inferred from ingredients and symbol modifiers (e.g., OU-D = dairy, OU-Glatt = meat).
    """.trimIndent()

    fun buildFullLabelPrompt(ocrText: String): String {
        return """
            {
              "task": "full_label_analysis",
              "ocr_text": "${ocrText.replace("\"", "\\\"")}",
              "image_context": "product_label_photo",
              "output_schema": {
                "product_name": "string or null",
                "brand": "string or null",
                "barcode": "string or null",
                "kosher_symbols": [{"symbol_code": "string", "modifier": "string or null", "detected_text": "string", "confidence": "float", "position_hint": "string or null"}],
                "ingredients": [{"name": "string", "is_flagged": "boolean", "flag_reason": "string or null", "kosher_status": "string: safe | caution | forbidden | unknown"}],
                "classification": {"dietary": "string", "passover_status": "string", "confidence": "float"},
                "manufacturer": "string or null",
                "country_of_origin": "string or null",
                "notes": "string or null"
              }
            }
        """.trimIndent()
    }

    fun buildIngredientPrompt(ingredients: List<String>, knownDietary: String): String {
        val ingredientList = ingredients.joinToString(", ")
        return """
            {
              "task": "ingredient_analysis",
              "ingredient_list": "$ingredientList",
              "known_dietary": "$knownDietary",
              "output_schema": {
                "risk_score": "float 0.0-1.0",
                "flagged_ingredients": [{"name": "string", "risk_level": "string", "explanation": "string", "typical_sources": ["string"], "recommendation": "string"}],
                "classification_override": "string or null",
                "summary": "string"
              }
            }
        """.trimIndent()
    }
}
```

---

## Part 3: Cost Estimates

### OpenAI API Costs (Per Scan)
| Model | Input Tokens | Output Tokens | Cost |
|---|---|---|---|
| GPT-4o | ~1,000 (OCR text + prompt) | ~500 (JSON response) | ~$0.0075 |
| GPT-4o-mini | ~1,000 | ~500 | ~$0.0005 |

**Strategy:** Use GPT-4o-mini for symbol-only quick checks (~$0.0005). Use GPT-4o only for full ingredient analysis (~$0.0075). At 1,000 scans/day, max cost = ~$7.50/day or ~$225/month.

### Blockchain Costs (Polygon PoS)
| Operation | Gas Used | Cost at 30 Gwei |
|---|---|---|
| Register certifier | ~80,000 | ~$0.02 |
| Certify product | ~120,000 | ~$0.03 |
| Verify (read) | 0 (view function) | FREE |

**Strategy:** Reads are free. Writes happen only by agencies, not consumers. Consumer app never pays gas.

---

*Document version 1.0 — Smart contract and AI prompts ready for implementation*
