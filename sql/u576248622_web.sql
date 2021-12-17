-- Create with some datos

CREATE DATABASE IF NOT EXISTS u576248622_web;

USE u576248622_web;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u576248622_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `uuid` varchar(36) NOT NULL,
  `guid` varchar(36) DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL,
  `verified` int(1) NOT NULL DEFAULT 0,
  `rank` int(2) NOT NULL DEFAULT 2,
  `email` varchar(254) NOT NULL,
  `emailVerified` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`uuid`, `guid`, `name`, `password`, `verified`, `rank`, `email`, `emailVerified`) VALUES
('04df7797-bf87-4d6c-bc10-efa29da2ed6c', NULL, 'Nn', 'a20cc4d9ad9b72eec00f5d727959862bf34e8b4166cd6ba50e0b9aa17bb2216a', 0, 2, 'automateautobot@gmail.com', 0),
('07cc4248-b678-430f-ac96-515c7489840a', NULL, 'Apika Luca', '812db8b4fd2257713e3ab99f0f390e6d08dc913dac105d518c88a800d93975d2', 0, 10, 'brayanquiralte07@gmail.com', 1),
('23d161db-9143-4222-9549-d0f2e2a86bd7', NULL, 'Apika Luca2', '812db8b4fd2257713e3ab99f0f390e6d08dc913dac105d518c88a800d93975d2', 0, 2, 'bjqf0724@gmail.com', 1),
('29357c81-011e-44f6-804b-5f8dd0df1ca2', NULL, 'BrahyamM', 'f457c0ba95b19a533139f9ea32ca41f5dd907d6565dd3afb45e36a7c7f51ff77', 0, 2, 'morevela26@gmail.com', 1),
('554a8e56-4ecb-4793-912a-2861bec21780', NULL, 'ColdStorm25', '7a1243c3a4b1cfb1a3ead2072a7760e508a5df1e7639f5faeed25b0680d661ff', 0, 9, 'diegojosuen50@gmail.com', 1),
('73cd2ccc-9701-4b78-9a18-3522e2fd8a15', NULL, 'Aitooor', '4443d8505535598d674f5170b32456975b068aa817a63aea4747459969520e0e', 0, 10, 'aitorarias19@gmail.com', 1),
('7d95853c-84f3-4648-bb6e-26a1e3bfbead', NULL, 'andqRoQT', '195c9e9b4718b6ded8b831b8ccc426ef08862f6a3ece3f932840ea0dcb7d4000', 0, 2, 'andqRoQT@burpcollaborator.net', 0),
('aaa98d1f-507e-4f6d-affd-4ca1edbf33da', NULL, 'saruman', '5bf70e93d6d2ac1b9fdf0c0d6b03c911ef5a3d01cd6ce69e70e8b0efce558807', 0, 2, 'themarlonmagic@gmail.com', 1),
('c4570227-fdee-4d16-9cf7-14461a17e288', NULL, 'haTEkspZ', 'dbc618e5eebf2737a8ed9d04c71683a16c1a7263bde2e5a068956bd0f57c8245', 0, 2, 'NXEmDpEF@burpcollaborator.net', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(20) NOT NULL,
  `display` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(36) NOT NULL,
  `min_rank` int(11) NOT NULL DEFAULT 0,
  `subcategories` text NOT NULL DEFAULT '[]',
  `order` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`uuid`, `name`, `display`, `description`, `image`, `min_rank`, `subcategories`, `order`) VALUES
('179aa820-3451-41ae-914d-5b17914a466f', 'SURVIVAL', '<b>{{NAME}}</b>', '', '', 1, '[]', '[\"9cdaf61d-8fe6-4d75-8f8c-ee49a62d2a37\"]'),
('19ffa2dd-46aa-4b2a-af40-808731a438eb', 'RANGOS GLOBALES', '{{NAME}}', '', '', 1, '[]', '[\"2b231e14-9e5d-4f76-85ef-6247fa788a99\"]'),
('280ca4c6-8ebf-4de9-b5d6-281f13d11da6', 'MICRO BATTLES', '<b>{{NAME}}</b>', '', '', 1, '[]', '[\"2b231e14-9e5d-4f76-85ef-6247fa788a99\"]'),
('387c5743-c4f2-42ab-be24-ecd7d7ac00a2', 'MAIN', '{{NAME}}', 'Descripcion principal', '', 1, '[\"9aaf38ea-fe11-4c84-99ce-c717d7b1158e\",\"179aa820-3451-41ae-914d-5b17914a466f\"]', '[]'),
('964c1ece-5ffc-4e83-aeb3-929bacfa9cd0', 'SKYBLOCK', '{{NAME}}', 'AUN NO', '', 1, '[]', '[]'),
('9aaf38ea-fe11-4c84-99ce-c717d7b1158e', 'BEDWARS', '<b>{{NAME}}</b>', '', '', 1, '[\"e973fe09-b2b5-4ed8-828c-720201f954d4\"]', '[\"9cdaf61d-8fe6-4d75-8f8c-ee49a62d2a37\",\"c585bd69-bdbb-4d87-9a52-9be285068479\"]'),
('ad28ada4-0647-4146-9381-7846dca00529', 'PRACTICE', '<b>{{NAME}}</b>', '', '', 1, '[]', '[\"2b231e14-9e5d-4f76-85ef-6247fa788a99\"]'),
('e973fe09-b2b5-4ed8-828c-720201f954d4', 'BEDWARS-LLAVES', 'LLAVES', '', '', 1, '[]', '[\"9cdaf61d-8fe6-4d75-8f8c-ee49a62d2a37\",\"3330045c-a362-40b0-b56c-75e7966e587b\"]');

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `value` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE IF NOT EXISTS `history` (
  `uuid` varchar(36) NOT NULL,
  `type` int(2) NOT NULL DEFAULT 1,
  `user_id` varchar(36) DEFAULT NULL,
  `user_name` varchar(50) NOT NULL,
  `amount` double NOT NULL,
  `product_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `uuid` varchar(36) NOT NULL,
  `name` varchar(30) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` longtext NOT NULL,
  `images` longtext DEFAULT NULL,
  `category` varchar(30) NOT NULL DEFAULT 'def',
  `created` decimal(14,0) DEFAULT NULL,
  `exec_cmd` varchar(255) DEFAULT NULL,
  `exec_params` longtext DEFAULT NULL,
  `sale` double(1,1) DEFAULT NULL,
  `sale_expires` decimal(14,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`uuid`, `name`, `price`, `description`, `images`, `category`, `created`, `exec_cmd`, `exec_params`, `sale`, `sale_expires`) VALUES
('3330045c-a362-40b0-b56c-75e7966e587b', 'Normal Key x5', '3.00', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quo plebiscito decreta a senatu est consuli quaestio Cn. Duarum enim vitarum nobis erunt instituta capienda. Duo Reges: constructio interrete. Qualem igitur hominem natura inchoavit? Huius, Lyco, oratione locuples, rebus ipsis ielunior. \nPrimum in nostrane potestate est, quid meminerimus? An vero, inquit, quisquam potest probare, quod perceptfum, quod. Itaque vides, quo modo loquantur, nova verba fingunt, deserunt usitata. Quae quo sunt excelsiores, eo dant clariora indicia naturae. At certe gravius. Quid dubitas igitur mutare principia naturae? ', '[]', 'KEY', '0', 'scrate [&&] tellraw', 'givekey Normal {{PlayerName}} 1 [&&] {{PlayerName}} {\"text\": \"{{PlayerName}} compraste: {{ItemName}}\"}', 0.0, '0'),
('9cdaf61d-8fe6-4d75-8f8c-ee49a62d2a37', 'Epic key x5', '3.00', '.\n', '[\"51df16b9-eac7-4d17-8717-970a73e10181\"]', 'KEY', '0', '', '', 0.0, '0'),
('9fb6cac1-1b14-4e2a-930b-0eb3428937db', 'Lee la descripcion!', '0.00', 'Ya puedes poner comandos pero primero prueba si te funciona antes de poner los finales.\nEl producto que es raro contiene los limites de las casillas.\nSi sucede algún bug visual solo recarga con el botón que puse, si no funciona recarga la página completa e informame que fue lo que pasó.\n\nAtte.\nApika Luca', '[]', 'DEV', '0', 'tellraw', '{{PlayerName}} {\"text\": \"{{PlayerName}} compraste {{ItemName}}.\"}', 0.0, '0'),
('c585bd69-bdbb-4d87-9a52-9be285068479', 'Rare Key x5', '3.00', '.', '[\"51df16b9-eac7-4d17-8717-970a73e10181\"]', 'KEY', '0', '', '', 0.0, '0');

-- --------------------------------------------------------

--
-- Table structure for table `update_posts`
--

CREATE TABLE IF NOT EXISTS `update_posts` (
  `uuid` varchar(36) NOT NULL,
  `title` tinytext NOT NULL,
  `content` longtext NOT NULL,
  `date` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `update_posts`
--
ALTER TABLE `update_posts`
  ADD PRIMARY KEY (`uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
