// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BondToken
 * @dev ERC-20 token representing fractional ownership of government bonds
 * Each token = $1 fraction of a government bond
 */
contract BondToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    // Mock stablecoin address (USDC/USDT)
    IERC20 public stablecoin;
    
    // Bond parameters
    uint256 public constant DECIMALS_FACTOR = 1e18;
    uint256 public bondAPY = 500; // 5.00% APY (in basis points)
    uint256 public totalBondValue; // Total value of underlying bonds
    uint256 public lastYieldDistribution;
    
    // Yield tracking per user
    mapping(address => uint256) public claimableYield;
    mapping(address => uint256) public lastClaimTime;
    
    // Events
    event BondsPurchased(address indexed buyer, uint256 amount);
    event BondsRedeemed(address indexed holder, uint256 amount);
    event YieldDistributed(uint256 totalYield);
    event YieldClaimed(address indexed holder, uint256 amount);
    event APYUpdated(uint256 newAPY);
    
    constructor(
        address _stablecoin,
        uint256 _initialBondValue
    ) ERC20("Tokenized US Treasury Bond", "USTB") Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        totalBondValue = _initialBondValue;
        lastYieldDistribution = block.timestamp;
    }
    
    /**
     * @dev Mint new bond tokens (admin only)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint (1 token = $1)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * DECIMALS_FACTOR);
        totalBondValue += amount;
    }
    
    /**
     * @dev Purchase bond tokens with stablecoins (1:1 ratio)
     * @param amount Amount of stablecoins to swap for bond tokens
     */
    function purchaseBonds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer stablecoins from buyer
        require(
            stablecoin.transferFrom(msg.sender, address(this), amount),
            "Stablecoin transfer failed"
        );
        
        // Mint bond tokens 1:1
        _mint(msg.sender, amount * DECIMALS_FACTOR);
        totalBondValue += amount;
        lastClaimTime[msg.sender] = block.timestamp;
        
        emit BondsPurchased(msg.sender, amount);
    }
    
    /**
     * @dev Redeem bond tokens for stablecoins
     * @param amount Amount of bond tokens to redeem
     */
    function redeemBonds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount * DECIMALS_FACTOR, "Insufficient bond balance");
        
        // Burn bond tokens
        _burn(msg.sender, amount * DECIMALS_FACTOR);
        totalBondValue -= amount;
        
        // Transfer stablecoins to holder
        require(
            stablecoin.transfer(msg.sender, amount),
            "Stablecoin transfer failed"
        );
        
        emit BondsRedeemed(msg.sender, amount);
    }
    
    /**
     * @dev Distribute yield to all token holders (simulated interest)
     * Called periodically by admin or automation
     */
    function distributeYield() external onlyOwner {
        uint256 timeSinceLastDistribution = block.timestamp - lastYieldDistribution;
        require(timeSinceLastDistribution >= 1 days, "Too soon to distribute");
        
        // Calculate daily yield based on APY
        // APY is in basis points, so 500 = 5%
        // Daily rate = APY / 365 / 10000
        uint256 dailyRate = bondAPY * timeSinceLastDistribution / 365 days;
        uint256 totalYield = (totalBondValue * dailyRate) / 10000;
        
        lastYieldDistribution = block.timestamp;
        
        emit YieldDistributed(totalYield);
    }
    
    /**
     * @dev Calculate claimable yield for a holder
     * @param holder Address of the token holder
     */
    function calculateYield(address holder) public view returns (uint256) {
        uint256 balance = balanceOf(holder);
        if (balance == 0) return 0;
        
        uint256 timeSinceLastClaim = block.timestamp - lastClaimTime[holder];
        uint256 dailyYield = (balance * bondAPY) / 365 days / 10000;
        
        return dailyYield * timeSinceLastClaim / DECIMALS_FACTOR;
    }
    
    /**
     * @dev Claim accumulated yield in stablecoins
     */
    function claimYield() external nonReentrant {
        uint256 yield = calculateYield(msg.sender) + claimableYield[msg.sender];
        require(yield > 0, "No yield to claim");
        
        claimableYield[msg.sender] = 0;
        lastClaimTime[msg.sender] = block.timestamp;
        
        require(
            stablecoin.transfer(msg.sender, yield),
            "Yield transfer failed"
        );
        
        emit YieldClaimed(msg.sender, yield);
    }
    
    /**
     * @dev Update bond APY (admin only)
     * @param newAPY New APY in basis points (e.g., 500 = 5%)
     */
    function setAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 2000, "APY too high"); // Max 20%
        bondAPY = newAPY;
        emit APYUpdated(newAPY);
    }
    
    /**
     * @dev Get current APY as a percentage (with 2 decimals)
     */
    function getAPYPercentage() external view returns (uint256) {
        return bondAPY; // Returns basis points (500 = 5.00%)
    }
}

/**
 * @title MockStablecoin
 * @dev Simple mock stablecoin for testing
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 1e18); // Mint 1M tokens to deployer
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
