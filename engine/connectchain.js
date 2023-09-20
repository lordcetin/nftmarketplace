/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { bscChain, polyChain, ethChain, hardChain, bscTest, ethTest, polyTest } from '../engine/chainchange';
import { Col, Dropdown } from '@nextui-org/react';
import React from 'react';
import { useEffect } from 'react';

export default function ConnectChain() {
    const [selected, setSelected] = React.useState(new Set(["Set Network"]));
    const selectedValue = React.useMemo(
      () => Array.from(selected).join(", ").replaceAll("_", " "),
      [selected]
    );

    const blockImage = React.useMemo(() => {
        var eth = "Ethereum";
        var bsc = "Binance Smart Chain";
        var pol = "Polygon";
        var mum = "Mumbai";
        var bsct = "Bsctest";
        var goe = "Goerli";
        var hard = "Hardhat";
        var init = "Set Network";
        if (selectedValue == eth) {
            return(
            <div className='flex gap-x-2 text-slate-400'>
                <img src='https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/116_Ethereum_logo_logos-256.png' className='object-contain w-6'/><span>Ethereum</span>
            </div>
            )
        }
        else if (selectedValue == bsc) {
          return(
          <div className='flex gap-x-2 text-slate-400'>
            <img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-contain w-6'/><span>Binance</span>
          </div>
          )
        }
        else if (selectedValue == pol) {
          return(
          <div className='flex gap-x-2 text-slate-400'>
            <img src='https://cryptologos.cc/logos/polygon-matic-logo.png' className='object-contain w-6'/><span>Polygon</span>
          </div>
          )
        }
        else if (selectedValue == mum) {
            return(
              <h3>Mumbai Testnet</h3>
            )
          }
        else if (selectedValue == bsct) {
            return(
                <h3>BSC Testnet</h3>
            )
          }
        else if (selectedValue == goe) {
            return(
                <h3>Goerli Testnet</h3>
            )
          }
        else if (selectedValue == hard) {
            return(
                <h3>Hardhat Node</h3>
            )
          }
        else if (selectedValue == init) {
            return(
                <div className='mt-4'>
                <h3>Change Network</h3>
                </div>
            )
          }
      })

    async function enableChain() {
        var bsc = "Binance Smart Chain";
        var poly = "Polygon";
        var eth = "Ethereum";
        var mum = "Mumbai";
        var bsct = "Bsctest";
        var goe = "Goerli";
        var hard = "Hardhat";
        if (bsc == selectedValue) {
          bscChain();
        } else if (poly == selectedValue) {
          polyChain();
        } else if (eth == selectedValue) {
          ethChain();
        } else if (hard == selectedValue) {
          hardChain();
        } else if (bsct == selectedValue) {
          bscTest();
        } else if (goe == selectedValue) {
          ethTest();
        } else if (mum == selectedValue) {
          polyTest();
        }
      }
      useEffect(() => {
        enableChain();
      }, [selected]);


    return (
        <Col className='z-10'>
          <Dropdown>
            <Dropdown.Button
            aria-label='Connect Wallet'
              flat
              css={{ tt: "capitalize" }}
              color="secondary"
              className='text-slate-400 bg-slate-900 text-lg outline-none'
            >
            {blockImage}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={setSelected}
              textValue={selected}
              className="bg-slate-900 text-slate-400"
            > 
              <Dropdown.Item textValue="Ethereum" key="Ethereum">
                <div className='flex text-slate-400 gap-x-2 text-lg'>
                    <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/116_Ethereum_logo_logos-256.png" className='object-contain w-6' /><span>Ethereum</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                textValue="Binance Smart Chain"
                key="Binance Smart Chain"
              >
                <div className='flex text-lg gap-x-2 text-slate-400'>
                    <img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-contain w-6'/><span>Binance</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item textValue="Polygon" key="Polygon">
                <div className='flex gap-x-2 text-slate-400'>
                    <img src='https://cryptologos.cc/logos/polygon-matic-logo.png' className='object-contain w-6'/><span>Polygon</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item textValue="Hardhat" key="Hardhat">
                HardHat Node
              </Dropdown.Item>
              <Dropdown.Item textValue="Goerli" key="Goerli">
                Goerli TestNet
              </Dropdown.Item>
              <Dropdown.Item textValue="Bsctest" key="Bsctest">
                BSC TestNet
              </Dropdown.Item>
              <Dropdown.Item textValue="Mumbai" key="Mumbai">
                Mumbai TestNet
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      );
 }