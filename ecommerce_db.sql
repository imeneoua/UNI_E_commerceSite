-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 01, 2026 at 11:42 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `email`, `password`) VALUES
(1, 'test@gmail.com', '$2y$10$V5l1eJUkNUGQhdZ1iRKVku0OCpBBG3jdXdbiqvlh7Q.SYDf3vdsoS'),
(4, 'alaebouya2@gmail.com', '$2y$10$uYIs26PrFF35VG23/GuTsOen1OTt3p6gRiS8L82rxHS69pcqyER2G'),
(5, 'alaabouya118@gmail.com', '$2y$10$L.dWsZPSaIKN3R3Zwyu/ZuZZHvIgJ/qvJptlZ/.5brrr1K/JLsGCK');

-- --------------------------------------------------------

--
-- Table structure for table `custumer`
--

DROP TABLE IF EXISTS `custumer`;
CREATE TABLE IF NOT EXISTS `custumer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`customer_id`),
  KEY `accound_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custumer`
--

INSERT INTO `custumer` (`customer_id`, `account_id`, `name`, `address`, `phone`) VALUES
(1, 4, '', '', ''),
(2, 5, '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `order_date` datetime NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_customer` (`customer_id`),
  KEY `fk_orders_product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `product_id`, `quantity`, `order_date`, `total_price`) VALUES
(4, 1, 58, 1, '2026-04-30 01:27:16', 2200.00),
(5, 2, 79, 1, '2026-04-30 01:33:29', 3000.00),
(6, 2, 79, 3, '2026-04-30 01:43:03', 9000.00),
(7, 1, 58, 1, '2026-04-30 02:02:28', 2200.00),
(8, 1, 95, 1, '2026-04-30 02:02:28', 2800.00),
(9, 1, 58, 2, '2026-04-30 02:04:28', 4400.00),
(10, 1, 59, 1, '2026-04-30 02:04:28', 2800.00),
(11, 1, 58, 1, '2026-04-30 02:08:03', 2200.00),
(12, 1, 105, 2, '2026-04-30 02:08:03', 4400.00),
(13, 1, 79, 1, '2026-05-01 11:39:18', 3000.00);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `name`, `price`, `category`, `image`, `description`) VALUES
(55, 'Amareta', 1000.00, 'Fantasy', 'images/book1.jpg', 'Secrets buried beneath the land of zikola'),
(56, 'Laws of Jartin', 1100.00, 'Fantasy', 'images/book2.jpg', 'Bloody rules rule the land of two jartin'),
(57, 'Searraush', 1200.00, 'Fantasy', 'images/book3.jpg', 'An epic fantasy adventure in the kingdom of rhetoic'),
(58, 'Harry Potter', 2200.00, 'Fantasy', 'images/book4.jpg', 'A boy discovers a magical world at Hogwarts school'),
(59, 'The Name of The Wind', 2800.00, 'Fantasy', 'images/book5.jpg', 'The journey of a legendary wizard'),
(60, 'Dead Until Dark', 2200.00, 'Fantasy', 'images/book6.jpg', 'Everyone here is smiling but no one is blinking'),
(61, 'Write Lest The Devil Devour Me', 2200.00, 'Horror', 'images/book7.jpg', 'Word or death'),
(62, 'It Happens at Night in the Locked Room', 1600.00, 'Horror', 'images/book8.jpg', 'Behind the locked door secrets dwell in the dark'),
(63, 'Fear', 2500.00, 'Horror', 'images/book9.jpg', 'Between what is seen and what is hidden'),
(64, 'I Am Rotting with Fear', 1800.00, 'Horror', 'images/book10.jpg', 'In the darkness of silence'),
(65, 'The Abyss', 2000.00, 'Horror', 'images/book11.jpg', 'Where darkness is the only escape'),
(66, 'The Far Lady\'s House', 1700.00, 'Horror', 'images/book12.jpg', 'The walls do not just listen they start closing in'),
(67, 'The Streets Murderer', 2200.00, 'Crime Fiction', 'images/book13.jpg', 'In darkness he hides in alleys he strikes'),
(68, 'Murder on the Orient Express', 1200.00, 'Crime Fiction', 'images/book14.jpg', 'Every suspect even the truth'),
(69, 'The Silent Patient', 1900.00, 'Crime Fiction', 'images/book15.jpg', 'The door I locked forever just opened from the inside'),
(70, 'And Then There Were None', 1200.00, 'Crime Fiction', 'images/book16.jpg', 'They played they laughed then in silence they passed'),
(71, 'Blood on the Red Carpet', 2000.00, 'Crime Fiction', 'images/book17.jpg', 'A white dress red stains and the killer laughs'),
(72, 'A Study In Scarlet', 1000.00, 'Crime Fiction', 'images/book18.jpg', 'A body with no wounds and a word written in blood'),
(73, 'Red Roses', 1500.00, 'Romantic Bouquets', 'images/flower1.jpg', 'Express your love with the classic Red Rose'),
(74, 'White Lilies', 7500.00, 'Romantic Bouquets', 'images/flower2.jpg', 'A grand bouquet of pure serenity and grace'),
(75, 'Pink Peonies', 9500.00, 'Romantic Bouquets', 'images/flower3.jpg', 'Softness and charm wrapped in a bouquet'),
(76, 'Red Tulips', 5500.00, 'Romantic Bouquets', 'images/flower4.jpg', 'Simple elegance profound love'),
(77, 'Purple Orchids', 11000.00, 'Romantic Bouquets', 'images/flower5.jpg', 'A touch of exotic luxury and rare beauty'),
(78, 'Sunflowers', 4800.00, 'Romantic Bouquets', 'images/flower6.jpg', 'Bring a piece of sunshine to someones heart'),
(79, 'Lavender', 3000.00, 'Home Decor', 'images/flower7.jpg', 'Calm your soul with the scent of serenity'),
(80, 'Hydrangea', 7000.00, 'Home Decor', 'images/flower8.jpg', 'Bold blooms for a vibrant home'),
(81, 'White Daisy', 3500.00, 'Home Decor', 'images/flower9.jpg', 'Simple joy in every petal'),
(82, 'Yellow Chrysanthemum', 3600.00, 'Home Decor', 'images/flower10.jpg', 'Energy and longevity for your home'),
(83, 'Red Anthurium', 7000.00, 'Home Decor', 'images/flower11.jpg', 'Bold exotic and heart-shaped elegance'),
(84, 'Gardenia', 5500.00, 'Home Decor', 'images/flower12.jpg', 'A natural perfume for your elegant home'),
(85, 'Black Bacaara Rose', 18000.00, 'Exotic & Luxury', 'images/flower13.jpg', 'Unveil the mystery of rare elegance'),
(86, 'Ghost Orchid', 35000.00, 'Exotic & Luxury', 'images/flower14.jpg', 'Own a piece of natures most beautiful mystery'),
(87, 'Bird of Paradise', 10000.00, 'Exotic & Luxury', 'images/flower15.jpg', 'Unleash the vibrant colors of paradise'),
(88, 'Blue Poppy', 21000.00, 'Exotic & Luxury', 'images/flower16.jpg', 'A rare dream of sapphire blue'),
(89, 'King Protea', 12000.00, 'Exotic & Luxury', 'images/flower17.jpg', 'The crown jewel of the floral world'),
(90, 'Cherry Blossom', 15500.00, 'Exotic & Luxury', 'images/flower18.jpg', 'A fleeting moment of pure elegance'),
(91, 'Retro Mechanical Keyboard', 8500.00, 'Smart Desk Gadgets', 'images/study1.jpg', 'Vintage vibes modern clicks'),
(92, 'Sunset Projection Lamp', 1800.00, 'Smart Desk Gadgets', 'images/study2.jpg', 'Bring the magic of the golden hour to your room'),
(93, 'Digital Flip Clock', 3500.00, 'Smart Desk Gadgets', 'images/study3.jpg', 'Classic timekeeping with a mechanical twist'),
(94, 'Wireless Bluetooth Mouse', 2200.00, 'Smart Desk Gadgets', 'images/study4.jpg', 'Silent clicks elegant movements'),
(95, 'Aesthetic Desk Humidifier', 2800.00, 'Smart Desk Gadgets', 'images/study5.jpg', 'Refresh your workspace and your mood'),
(96, 'Mini Photo Printer', 9500.00, 'Smart Desk Gadgets', 'images/study6.jpg', 'Print your memories instantly anywhere'),
(97, 'Aesthetic Storage Crate', 1500.00, 'Desk Organization', 'images/study7.jpg', 'Foldable style for a tidy desk'),
(98, 'Acrylic Monitor Stand', 3800.00, 'Desk Organization', 'images/study8.jpg', 'Elevate your screen and your style'),
(99, 'Pegboard Desk Organizer', 4500.00, 'Desk Organization', 'images/study9.jpg', 'Infinite ways to organize your wall'),
(100, 'Minimalist Pen Holder', 850.00, 'Desk Organization', 'images/study10.jpg', 'Simplicity meets functionality'),
(101, 'Transparent Desk Mat', 1900.00, 'Desk Organization', 'images/study11.jpg', 'Protect your desk showcase your style'),
(102, 'Kawaii Storage Drawers', 1500.00, 'Desk Organization', 'images/study12.jpg', 'Store your treasures in a cute way'),
(103, 'Morandi Gel Pens', 950.00, 'Stationery & Paper', 'images/study13.jpg', 'Smooth writing in every shade'),
(104, 'Vintage Scrapbook Paper', 800.00, 'Stationery & Paper', 'images/study14.jpg', 'Add a touch of history to your journal'),
(105, 'Aesthetic Spiral Planner', 2200.00, 'Stationery & Paper', 'images/study15.jpg', 'Plan your dreams beautifully'),
(106, 'Flower Petal Washi Tape', 550.00, 'Stationery & Paper', 'images/study16.jpg', 'Decorate with natures beauty'),
(107, 'Clear Acrylic Clipboard', 1800.00, 'Stationery & Paper', 'images/study17.jpg', 'The modern way to take notes'),
(108, 'Pastel Sticky Notes', 450.00, 'Stationery & Paper', 'images/study18.jpg', 'Colorful reminders that stick');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `custumer`
--
ALTER TABLE `custumer`
  ADD CONSTRAINT `custumer_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `custumer` (`customer_id`),
  ADD CONSTRAINT `fk_orders_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
