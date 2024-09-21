// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract StudentIdentification {
    address owner;
    uint256 public totalCardsIssued;

    struct StudentCard {
        string hashCard;
        uint256 expDate;
        address studentPublicKey;
        bool isValid;
    }

    mapping(address => StudentCard) studentCards;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'SEM ACESSO!');
        _;
    }

    function issueCard(
        string memory _hashCard,
        uint256 _expDate,
        address _studentPublicKey
    ) public onlyOwner {
        require(
            bytes(studentCards[_studentPublicKey].hashCard).length == 0,
            'Ja existe uma carteira emitida para essa chave publica.'
        );

        totalCardsIssued++;

        studentCards[_studentPublicKey] = StudentCard({
            hashCard: _hashCard,
            expDate: _expDate,
            studentPublicKey: _studentPublicKey,
            isValid: true
        });
    }

    function getCard(
        address _studentPublicKey
    ) public view returns (StudentCard memory) {
        require(
            bytes(studentCards[_studentPublicKey].hashCard).length > 0,
            'Carteira nao encontrada.'
        );

        return studentCards[_studentPublicKey];
    }

    function invalidateCard(address _studentPublicKey) public onlyOwner {
        require(
            bytes(studentCards[_studentPublicKey].hashCard).length > 0,
            'Carteira nao encontrada.'
        );

        studentCards[_studentPublicKey].isValid = false;
    }

    function extendCardExpiration(
        address _studentPublicKey,
        uint256 _newExpDate
    ) public onlyOwner {
        require(
            bytes(studentCards[_studentPublicKey].hashCard).length > 0,
            'Carteira nao encontrada.'
        );
        require(
            _newExpDate > studentCards[_studentPublicKey].expDate,
            'Nova data de expiracao deve ser maior que a atual.'
        );

        studentCards[_studentPublicKey].expDate = _newExpDate;
    }
}
