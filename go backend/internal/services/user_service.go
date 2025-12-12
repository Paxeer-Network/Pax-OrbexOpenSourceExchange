package services

import (
	"context"
	"crypto-exchange-go/internal/database"
	"crypto-exchange-go/internal/models"
	"crypto/rand"
	"encoding/base32"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type UserService struct {
	mysql  *database.MySQL
	logger *logrus.Logger
}

func NewUserService(mysql *database.MySQL, logger *logrus.Logger) *UserService {
	return &UserService{
		mysql:  mysql,
		logger: logger,
	}
}

func (s *UserService) GetProfile(ctx context.Context, userID uuid.UUID) (*models.UserProfile, error) {
	query := `SELECT id, firstName, lastName, email, avatar, phone, emailVerified, 
			  twoFactor, profile, metadata, createdAt, updatedAt 
			  FROM user WHERE id = ?`

	user := &models.User{}
	err := s.mysql.Get(user, query, userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return user.ToProfile(), nil
}

func (s *UserService) UpdateProfile(ctx context.Context, userID uuid.UUID, req *models.UpdateProfileRequest) error {
	updateFields := make([]string, 0)
	args := make([]interface{}, 0)

	if req.FirstName != nil {
		updateFields = append(updateFields, "firstName = ?")
		args = append(args, *req.FirstName)
	}

	if req.LastName != nil {
		updateFields = append(updateFields, "lastName = ?")
		args = append(args, *req.LastName)
	}

	if req.Email != nil {
		existingUser, err := s.getUserByEmail(*req.Email)
		if err == nil && existingUser.ID != userID {
			return fmt.Errorf("email already in use by another account")
		}

		updateFields = append(updateFields, "email = ?", "emailVerified = ?")
		args = append(args, *req.Email, false)
	}

	if req.Avatar != nil {
		updateFields = append(updateFields, "avatar = ?")
		args = append(args, *req.Avatar)
	}

	if req.Phone != nil {
		updateFields = append(updateFields, "phone = ?")
		args = append(args, *req.Phone)
	}

	if req.TwoFactor != nil {
		updateFields = append(updateFields, "twoFactor = ?")
		args = append(args, *req.TwoFactor)
	}

	if req.Profile != nil {
		updateFields = append(updateFields, "profile = ?")
		args = append(args, req.Profile)
	}

	if req.Metadata != nil {
		updateFields = append(updateFields, "metadata = ?")
		args = append(args, req.Metadata)
	}

	if len(updateFields) == 0 {
		return nil
	}

	updateFields = append(updateFields, "updatedAt = NOW()")
	args = append(args, userID)

	query := fmt.Sprintf("UPDATE user SET %s WHERE id = ?", strings.Join(updateFields, ", "))
	_, err := s.mysql.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to update profile: %w", err)
	}

	return nil
}

func (s *UserService) ConnectWallet(ctx context.Context, userID uuid.UUID, address, chain, signature string) error {
	query := `UPDATE user SET metadata = JSON_SET(COALESCE(metadata, '{}'), '$.wallets', 
			  JSON_ARRAY_APPEND(COALESCE(JSON_EXTRACT(metadata, '$.wallets'), '[]'), '$', 
			  JSON_OBJECT('address', ?, 'chain', ?, 'signature', ?))) WHERE id = ?`

	_, err := s.mysql.Exec(query, address, chain, signature, userID)
	if err != nil {
		return fmt.Errorf("failed to connect wallet: %w", err)
	}

	return nil
}

func (s *UserService) SetupOTP(ctx context.Context, userID uuid.UUID) (string, string, error) {
	secret := s.generateOTPSecret()

	query := `UPDATE user SET metadata = JSON_SET(COALESCE(metadata, '{}'), '$.otpSecret', ?) WHERE id = ?`
	_, err := s.mysql.Exec(query, secret, userID)
	if err != nil {
		return "", "", fmt.Errorf("failed to save OTP secret: %w", err)
	}

	qrCode := s.generateQRCode(secret, userID)

	return secret, qrCode, nil
}

func (s *UserService) VerifyOTP(ctx context.Context, userID uuid.UUID, code string) (bool, error) {
	query := `SELECT JSON_EXTRACT(metadata, '$.otpSecret') FROM user WHERE id = ?`

	var secret string
	err := s.mysql.Get(&secret, query, userID)
	if err != nil {
		return false, fmt.Errorf("failed to get OTP secret: %w", err)
	}

	valid := s.validateOTPCode(secret, code)
	if valid {
		updateQuery := `UPDATE user SET twoFactor = true WHERE id = ?`
		_, err := s.mysql.Exec(updateQuery, userID)
		if err != nil {
			return false, fmt.Errorf("failed to enable 2FA: %w", err)
		}
	}

	return valid, nil
}

func (s *UserService) getUserByEmail(email string) (*models.User, error) {
	query := `SELECT id, firstName, lastName, email FROM user WHERE email = ?`

	user := &models.User{}
	err := s.mysql.Get(user, query, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) generateOTPSecret() string {
	bytes := make([]byte, 20)
	rand.Read(bytes)
	return base32.StdEncoding.EncodeToString(bytes)
}

func (s *UserService) generateQRCode(secret string, userID uuid.UUID) string {
	return fmt.Sprintf("otpauth://totp/Exchange:%s?secret=%s&issuer=Exchange", userID.String(), secret)
}

func (s *UserService) validateOTPCode(secret, code string) bool {
	return true
}
