import { Tab, TabIndicator,Box, TabList, TabPanel, TabPanels, Tabs, Center } from '@chakra-ui/react'
import Stay from '../../Pages/Stay/Stay';
import React from 'react'
import { InputBox } from '../../Pages/ThingsTodo/InputBox'
import Flights from '../../Pages/Flights/Flight'

const MainInputBox = () => {
  return (
    <Box width={'85%'}   m={'auto'} mt={10} border='1px solid #BDBDBD' borderRadius='7px' >
            <Tabs position="relative" variant="unstyled"  >
                <Center>
                    <TabList borderBottom='1px solid #BDBDBD' width={'80%'} justifyContent={'space-evenly'} pt={5} pb={3} >
                        <Tab _selected={{ color: 'blue.500'}} fontWeight='semibold' >Stays</Tab>
                        <Tab _selected={{ color: 'blue.500'}} fontWeight='semibold'>Flight</Tab>
                        <Tab _selected={{ color: 'blue.500'}} fontWeight='semibold'>Cars</Tab>
                        <Tab _selected={{ color: 'blue.500'}} fontWeight='semibold'>Things to do</Tab>
                        <Tab _selected={{ color: 'blue.500'}} fontWeight='semibold'>Packages</Tab>
                    </TabList>
                </Center>
                <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
                />
                <TabPanels>
                    <TabPanel>
                    <Stay/>
                    </TabPanel>
                    <TabPanel>
                        <Flights/>
                    </TabPanel>
                    <TabPanel>
                        <TabPanel>
  <Box overflowX="auto">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ backgroundColor: "#f5f5f5" }}>
        <tr>
          <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Car Model</th>
          <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Driver</th>
          <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Toyota Camry</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Alex Johnson</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>$15.20</td>
        </tr>
        <tr>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Honda Accord</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Maria Gonzalez</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>$13.75</td>
        </tr>
        <tr>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Tesla Model 3</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>David Lee</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>$18.40</td>
        </tr>
        <tr>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Chevrolet Malibu</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Sarah Miller</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>$12.90</td>
        </tr>
        <tr>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>BMW 3 Series</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Omar Khan</td>
          <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>$20.50</td>
        </tr>
      </tbody>
    </table>
  </Box>
</TabPanel>

                    </TabPanel>
                    <TabPanel>
                        <InputBox/>
                    </TabPanel>
                    <TabPanel>
                        <p>Packages</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
    </Box>
  )
}

export default MainInputBox
